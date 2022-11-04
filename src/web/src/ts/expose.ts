import { timeLimitations } from './setup';
import { cycle } from './windows/calendar';

export default () => {
  class windowTools {
    open(parent: Number) {
      console.log('Using parent class: ', parent);
    }

    switch(parent: string, index: Number) {
      console.log('Using parent class: ', parent);
      console.log('Using index: ', index);
    }
  }

  class calendarTools {
    o: number;
    downLocked: boolean;
    upLocked: boolean;

    constructor() {
      this.o = 0;
      this.downLocked = false;
      this.upLocked = false;
    }

    cycle(offset: number) {
      let limit = cycle(timeLimitations, offset);
      if (!limit.backwards && !limit.forwards) {
        this.o = offset;
      }
    }

    increment(offset: number) {
      cycle(timeLimitations, this.o + offset);
      this.o += offset;
    }
  }

  //@ts-ignore
  window.moveableWindowTools = new windowTools();

  //@ts-ignore
  window.calendarTools = new calendarTools();
};
