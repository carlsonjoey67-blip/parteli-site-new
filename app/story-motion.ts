const clamp = (value: number) => Math.max(0, Math.min(1, value));

// Reduced motion changes travel distance, never the content or story order.
export function sceneState(elapsed: number, reduced: boolean, handover: boolean) {
  const entrance = clamp(elapsed / 1700);
  const arrival = reduced ? 1 : 1 - Math.pow(1 - entrance, 3);
  const travel = clamp((elapsed - 3200) / 1150);
  const exit = travel * travel * (3 - 2 * travel);
  const workflow = handover ? 1 : clamp((elapsed - 3950) / 750);
  const duration = handover ? 6800 : 10300;
  return {
    arrival,
    duration,
    progress: clamp(elapsed / duration),
    conversationElapsed: Math.max(0, elapsed - (handover ? 1200 : 4700)),
    exit,
    workflow,
    depart: reduced || exit === 0 ? 0 : -exit * 125,
    vehicleOpacity: 1 - clamp((exit - .5) * 2),
    workflowY: reduced ? 0 : (1 - workflow) * 45,
    phase: handover ? "workflow" : elapsed < 1700 ? "entering" : exit === 0 ? "vehicle" : exit < 1 ? "departing" : "workflow",
  };
}

export function conversationFrame(elapsed: number, length: number) {
  const action = clamp(elapsed / 5600);
  return {
    step: action >= .85 ? 3 : action >= .43 ? 2 : action >= .12 ? 1 : 0,
    chars: Math.floor(clamp((action - .43) / .4) * length),
  };
}
