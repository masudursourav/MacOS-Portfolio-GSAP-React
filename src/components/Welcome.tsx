import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

type FontWeightType = "title" | "description";

const FONT_WEIGHT: Record<
  FontWeightType,
  { max: number; min: number; default: number }
> = {
  title: { max: 900, min: 400, default: 400 },
  description: { max: 400, min: 100, default: 100 },
};

const renderText = (text: string, className: string, baseWeight = 400) =>
  text.split("").map((char, index) => (
    <span
      key={index}
      className={className}
      style={{ fontWeight: baseWeight, display: "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

const setupTextHover = (
  container: HTMLElement | null,
  type: FontWeightType,
) => {
  if (!container) return;

  const letters = container.querySelectorAll("span");
  const { max, min, default: base } = FONT_WEIGHT[type];
  const animateLetter = (
    letter: HTMLElement,
    weight: number,
    duration = 0.25,
  ) =>
    gsap.to(letter, {
      fontVariationSettings: `'wght' ${weight}`,
      duration,
      ease: "power2.out",
    });

  const handleMouseMove = (event: MouseEvent) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = event.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 20000);

      animateLetter(letter as HTMLElement, base + (max - min) * intensity);
    });
  };
  const handleMouseLeave = () => {
    letters.forEach((letter) =>
      animateLetter(letter as HTMLElement, base, 0.3),
    );
  };

  container.addEventListener("mouseleave", handleMouseLeave);
  container.addEventListener("mousemove", handleMouseMove);
  return () => {
    container.removeEventListener("mouseleave", handleMouseLeave);
    container.removeEventListener("mousemove", handleMouseMove);
  };
};

export default function Welcome() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const descriptionCleanup = setupTextHover(
      descriptionRef.current,
      "description",
    );

    return () => {
      if (titleCleanup && descriptionCleanup) {
        titleCleanup();
        descriptionCleanup();
      }
    };
  }, []);
  return (
    <section id="welcome">
      <h1 ref={titleRef}>
        {renderText("Welcome!", "text-9xl italic font-georama")}
      </h1>
      <p ref={descriptionRef}>
        {renderText(
          "Feel free to explore my work and get to know me better.",
          "text-2xl font-georama",
          100,
        )}
      </p>
    </section>
  );
}
