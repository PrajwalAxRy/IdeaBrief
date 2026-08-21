/** Skip to `#main`, hidden until focused. `.ob-skip` lives in
 *  styles/obsidian.css §12. Mounted by `RunShell` in A4 (R19). */
export function SkipLink() {
  return (
    <a href="#main" className="ob-skip">
      Skip to content
    </a>
  );
}
