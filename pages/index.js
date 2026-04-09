import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function callApi() {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/hello");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.badge}>Deployed on Vercel</div>

        <h1 className={styles.title}>Vercel PoC</h1>
        <p className={styles.subtitle}>
          Next.js · Serverless API · Instant Deployments
        </p>

        <button
          className={styles.button}
          onClick={callApi}
          disabled={loading}
        >
          {loading ? "Calling API…" : "Call /api/hello"}
        </button>

        {error && (
          <div className={styles.card} data-variant="error">
            <span className={styles.label}>Error</span>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className={styles.card} data-variant="success">
            <span className={styles.label}>API Response</span>
            <dl className={styles.dl}>
              <div>
                <dt>Message</dt>
                <dd>{response.message}</dd>
              </div>
              <div>
                <dt>Timestamp</dt>
                <dd>{response.timestamp}</dd>
              </div>
              <div>
                <dt>Environment</dt>
                <dd>{response.environment}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>{response.region}</dd>
              </div>
            </dl>
            <pre className={styles.pre}>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}

        <section className={styles.info}>
          <h2>How it works</h2>
          <ol>
            <li>The button triggers a <code>fetch()</code> to <code>/api/hello</code></li>
            <li>Vercel routes the request to a serverless function</li>
            <li>The function returns JSON — message + timestamp + metadata</li>
            <li>The UI renders the response instantly</li>
          </ol>
        </section>
      </main>

      <footer className={styles.footer}>
        Vercel PoC &mdash; Next.js {process.env.NEXT_PUBLIC_APP_VERSION || "14"}
      </footer>
    </div>
  );
}
