class TurnCycle {
  constructor({ battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
    this.currentTeam = "player"; 
  }

  async turn() {
    const caster = this.battle.combatants["player"];
    const enemy = this.battle.combatants["enemy"];

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy
    });

    if (submission.instanceId) {
      this.battle.usedInstanceIds[submission.instanceId] = true;

      this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId);
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success);

    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({
        type: "textMessage", text: `${submission.target.name} is defeated!`
      });

      if (submission.target === enemy) {
        const xp = submission.target.givesXp;

        await this.onNewEvent({
          type: "textMessage",
          text: `Gained ${xp} XP!`
        });
        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: caster
        });
      }
    }

    const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${winner} wins the battle!`
      });
      this.onWinner(winner);
      return;
    }

    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }

    this.nextTurn();
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
  }

  getWinningTeam() {
    const playerAlive = this.battle.combatants["player"].hp > 0;
    const enemyAlive = this.battle.combatants["enemy"].hp > 0;

    if (!playerAlive) return "enemy";
    if (!enemyAlive) return "player";
    return null;
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `${this.battle.enemy.name} has appeared!`
    });

    this.turn();
  }
}
