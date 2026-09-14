/**
 * Editorial scaffolding. Everything in this file is temporary.
 *
 * `Flag` marks a fact that has not been confirmed. `PhotoSlot` marks a
 * photograph that does not exist yet. Both are deliberately loud: nothing
 * unverified should be able to reach a customer wearing the same clothes as
 * settled copy.
 *
 * When `content/flags.ts` is empty and neither component appears in the tree,
 * the site is ready to launch.
 */

export function Flag({
  label = "Unconfirmed",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flagbox" role="note">
      <b>{label}</b>
      <p>{children}</p>
    </div>
  );
}

export function PhotoSlot({
  title,
  detail,
  minHeight,
}: {
  title: string;
  detail?: string;
  minHeight?: string;
}) {
  return (
    <div className="photoslot" style={minHeight ? { minHeight } : undefined}>
      <strong>Photograph needed</strong>
      <span>{title}</span>
      {detail ? <span>{detail}</span> : null}
    </div>
  );
}
