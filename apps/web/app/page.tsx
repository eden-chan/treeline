import Tree from "../components/tree";
import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <Tree />
    </main>
  );
}
