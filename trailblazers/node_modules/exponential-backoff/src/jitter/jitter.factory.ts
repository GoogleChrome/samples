import { IBackOffOptions } from "../options";
import { fullJitter } from "./full/full.jitter";
import { noJitter } from "./no/no.jitter";

export type Jitter = (delay: number) => number;

export function JitterFactory(options: IBackOffOptions): Jitter {
  switch (options.jitter) {
    case "full":
      return fullJitter;

    case "none":
    default:
      return noJitter;
  }
}
