'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Loader.module.css';

export default function Loader() {
  const stageRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const drawPathRef = useRef<SVGPathElement>(null);
  const [sliding, setSliding] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const stage = stageRef.current!;
    const logoWrap = logoWrapRef.current!;
    const drawPath = drawPathRef.current!;

    document.body.style.overflow = 'hidden';

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    function prepDraw() {
      const len = drawPath.getTotalLength();
      drawPath.style.strokeDasharray = String(len);
      drawPath.style.strokeDashoffset = String(len);
      drawPath.getBoundingClientRect();
      drawPath.style.transition = `stroke-dashoffset 1100ms cubic-bezier(.65,0,.35,1)`;
    }

    function centerLogoInitially() {
      logoWrap.style.transition = 'none';
      logoWrap.style.transform = 'translateX(0)';
      logoWrap.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const logoRect = logoWrap.getBoundingClientRect();
      const logoCenterX = logoRect.left + logoRect.width / 2;
      const stageCenterX = stageRect.left + stageRect.width / 2;
      const delta = stageCenterX - logoCenterX;
      logoWrap.style.transform = `translateX(${delta}px)`;
      logoWrap.getBoundingClientRect();
    }

    async function playSequence() {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        stage.classList.add(
          styles.fillIn,
          styles.drawDone,
          styles.revealDivider,
          styles.revealText
        );
        await wait(0);
        document.body.style.overflow = '';
        setHidden(true);
        return;
      }

      drawPath.style.transition = 'none';
      drawPath.style.opacity = '1';
      prepDraw();

      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch {}
      }
      centerLogoInitially();
      logoWrap.style.opacity = '1';

      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // 1. draw the outline
      drawPath.style.strokeDashoffset = '0';
      await wait(1100);

      // 2. fill in place, fade the sketch outline out
      stage.classList.add(styles.fillIn, styles.drawDone);
      await wait(550);

      // 3. slide the icon from center into its final row position
      logoWrap.style.transition = 'transform 700ms cubic-bezier(.65,0,.35,1)';
      requestAnimationFrame(() => { logoWrap.style.transform = 'translateX(0)'; });
      await wait(700);

      // 4. reveal the divider, then the name
      stage.classList.add(styles.revealDivider);
      await wait(250);

      stage.classList.add(styles.revealText);
      await wait(700);

      // 5. slide the whole loader up to reveal the page beneath
      setSliding(true);
      await wait(700);
      document.body.style.overflow = '';
      setHidden(true);
    }

    playSequence();

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={stageRef}
      className={`${styles.stage} ${sliding ? styles.slideUp : ''}`}
      aria-hidden="true"
    >
      <div className={styles.lockup}>
        <div ref={logoWrapRef} className={styles.logoWrap}>
          <svg
            className={styles.logoSvg}
            viewBox="0 0 421 207"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className={styles.fillGroup}>
              <path d="M95.3649 12.9283C51.5811 106.401 31.6077 199.954 0.5 194.997V199.873H44.2838V197.435C30.1203 192.317 26.9555 187.505 33.7432 173.864L50.1525 133.223L51.4653 129.972L88.8784 37.3125L89.6892 38.9381L90.5737 41.063C105.309 76.4632 117.671 106.162 128.946 129.972C129.465 131.068 129.982 132.152 130.497 133.223C147.217 168.03 154.554 182.805 178.068 197.435C201.581 212.065 227.385 206.681 244.554 197.435C261.723 188.189 265.635 173.051 270.5 155.982C271.609 152.09 274.784 143.762 279.024 133.223C279.451 132.161 279.889 131.077 280.337 129.972C294.94 93.9583 319.959 36.4996 319.959 36.4996C333.242 71.2974 349.234 103.67 361.619 129.972C362.134 131.066 362.644 132.15 363.146 133.223C380.155 169.557 389.484 193.544 373.473 194.997V200.686H420.5V194.997C399.419 197.435 373.856 121.31 326.446 12.9283L270.5 147.854C256.081 94.2499 236.43 107.001 186.176 64.135C158.608 37.3124 179.125 3.0449 211.311 3.1746C231.25 3.1746 245.834 12.682 248.608 36.4996H251.041V8.8643C214.649 -3.57731 190.495 -2.50821 174.824 14.5539C159.153 31.6161 156.005 59.2512 174.824 76.3271C193.644 93.4029 225.905 109.652 225.905 109.652C276.986 138.913 268.221 206.382 200.77 200.686C185.139 198.352 172.082 184.124 159.047 160.859C157.177 157.52 155.307 153.995 153.429 150.292C136.497 116.895 118.987 69.0414 95.3649 12.9283Z" />
              <path d="M361.619 129.972H280.337C279.889 131.077 279.451 132.161 279.024 133.223H363.146C362.644 132.15 362.134 131.066 361.619 129.972Z" />
              <path d="M159.047 160.859C155.652 134.705 163.775 123.108 188.608 105.588C163.071 118.576 155.525 128.424 153.429 150.292C155.307 153.995 157.177 157.52 159.047 160.859Z" />
              <path d="M128.946 129.972H51.4653L50.1525 133.223H130.497C129.982 132.152 129.465 131.068 128.946 129.972Z" />
            </g>

            <path
              ref={drawPathRef}
              className={styles.drawPath}
              d="M90.5737 41.063C90.2798 40.357 89.985 39.6487 89.6892 38.9381L88.8784 37.3125L51.4653 129.972M89.6892 38.9381L90.5737 41.063M51.4653 129.972C77.2922 129.972 128.946 129.972 128.946 129.972M153.429 150.292C136.497 116.895 118.987 69.0414 95.3649 12.9283C51.5811 106.401 31.6077 199.954 0.5 194.997V199.873H44.2838V197.435C30.1203 192.317 26.9555 187.505 33.7432 173.864L50.1525 133.223L51.4653 129.972M51.4653 129.972H128.946M280.337 129.972C279.889 131.077 279.451 132.161 279.024 133.223C274.784 143.762 271.609 152.09 270.5 155.982C265.635 173.051 261.723 188.189 244.554 197.435C227.385 206.681 201.581 212.065 178.068 197.435C154.554 182.805 147.217 168.03 130.497 133.223C129.982 132.152 129.465 131.068 128.946 129.972M128.946 129.972C117.671 106.162 105.309 76.4632 90.5737 41.063M50.1525 133.223C76.9339 133.223 130.497 133.223 130.497 133.223M50.1525 133.223H130.497M280.337 129.972C294.94 93.9583 319.959 36.4996 319.959 36.4996C333.242 71.2974 349.234 103.67 361.619 129.972M280.337 129.972H361.619M361.619 129.972C362.134 131.066 362.644 132.15 363.146 133.223M279.024 133.223H363.146M153.429 150.292C155.306 153.995 157.177 157.52 159.047 160.859C172.082 184.124 185.139 198.352 200.77 200.686C268.221 206.382 276.986 138.913 225.905 109.652C225.905 109.652 193.644 93.4029 174.824 76.3271C156.005 59.2513 159.153 31.6161 174.824 14.5539C190.495 -2.50821 214.649 -3.57732 251.041 8.8643V36.4996H248.608C245.834 12.682 231.25 3.1746 211.311 3.1746C179.125 3.0449 158.608 37.3124 186.176 64.135C236.43 107.001 256.081 94.2499 270.5 147.854L326.446 12.9283C373.856 121.31 399.419 197.435 420.5 194.997V200.686H373.473V194.997C389.484 193.544 380.155 169.557 363.146 133.223M159.047 160.859C155.652 134.705 163.775 123.108 188.608 105.588C163.071 118.576 155.525 128.424 153.429 150.292"
            />
          </svg>
        </div>

        <div className={styles.divider} />

        <div className={styles.textBlock}>
          <div className={`${styles.line} ${styles.line1} font-aboreto font-bold`}>
            <span className={styles.lineText}>Architect</span>
          </div>
          <div className={`${styles.line} ${styles.line2} font-aboreto font-bold`}>
            <span className={styles.lineText}>Shahbaz Ahmed</span>
          </div>
          <div className={`${styles.line} ${styles.line3} font-aboreto font-bold`}>
            <span className={styles.lineText}>Shaikh</span>
          </div>
        </div>
      </div>
    </div>
  );
}