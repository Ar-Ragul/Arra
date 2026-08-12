import { profile } from '../data/resume';
import { ContactBadge } from './ContactBadge';
import { Reveal } from './Reveal';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <>
      <section id="contact" className={styles.contact}>
        <div className={styles.mesh} aria-hidden="true">
          <span className={`${styles.blob} ${styles.blobBlue}`} />
          <span className={`${styles.blob} ${styles.blobViolet}`} />
          <span className={`${styles.blob} ${styles.blobTeal}`} />
        </div>

        <div className={`container ${styles.content}`}>
          <Reveal>
            <h2 className={`section-title ${styles.title}`}>Let’s build something worth shipping.</h2>
            <p className={`section-lede ${styles.lede}`}>
              Open to full-stack and front-end roles where craft and speed both matter. Flick the badge, or hit
              contact — I usually reply within a day.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <ContactBadge />
          </Reveal>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <p className={styles.copyright}>© {new Date().getFullYear()} {profile.name}</p>
            <a
              href="#home"
              className={`${styles.toTop} press`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Back to top
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
