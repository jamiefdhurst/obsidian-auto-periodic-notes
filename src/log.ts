export default function debug(msg: string): void {
  console.debug(`[JH:APN] ${msg}`);
}

export function error(msg: string): void {
  console.error(`[JH:APN] ${msg}`);
}
