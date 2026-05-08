import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const HOME_CARDS = [
  {
    to: "/chronological",
    imageSrc: "/home/chronological.png",
    titleKey: "nav.chronological",
    descKey: "home.cards.chronological",
  },
  {
    to: "/compass",
    imageSrc: "/home/compass.png",
    titleKey: "nav.compass",
    descKey: "home.cards.compass",
  },
  {
    to: "/atlas",
    imageSrc: "/home/atlas.png",
    titleKey: "nav.atlas",
    descKey: "home.cards.atlas",
  },
  {
    to: "/graph",
    imageSrc: "/home/graph.png",
    titleKey: "nav.graph",
    descKey: "home.cards.graph",
  },
] as const;

function HomeFeatureCard(props: (typeof HOME_CARDS)[number]) {
  const { t } = useTranslation();
  return (
    <Link
      to={props.to}
      className="group grid h-[min(34rem,48vh)] w-full min-w-0 grid-rows-[35%_65%] overflow-hidden rounded-2xl border border-sage-primary/40 bg-white/90 shadow-md transition hover:border-sage-forest/50 hover:shadow-lg sm:h-[min(36rem,50vh)] sm:max-w-2xl sm:justify-self-center lg:max-w-none lg:justify-self-stretch lg:h-[min(38rem,52vh)]"
    >
      <div className="relative min-h-0 w-full overflow-hidden">
        <img
          src={props.imageSrc}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-sage-dark/25" />
      </div>
      <div className="flex min-h-0 flex-col justify-center gap-2 overflow-y-auto p-5 sm:gap-2.5 sm:p-6">
        <h3 className="text-lg font-semibold tracking-tight text-sage-dark group-hover:text-sage-forest sm:text-xl">
          {t(props.titleKey)}
        </h3>
        <p className="text-[0.9375rem] leading-relaxed text-sage-dark/85 sm:text-base">
          {t(props.descKey)}
        </p>
      </div>
    </Link>
  );
}

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-sage-bg">
      <section className="relative isolate h-[min(94vh,980px)] min-h-[18rem] w-full overflow-hidden sm:h-[min(92vh,960px)]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src="/scriptureGraph_Home.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-b from-sage-dark/55 via-sage-dark/35 to-sage-dark/60"
          aria-hidden
        />
        <div className="relative flex h-full flex-col items-center justify-center px-4 py-10 sm:py-12">
          <h1 className="text-center font-serif text-4xl font-bold tracking-[0.18em] text-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 text-center text-sm font-semibold tracking-[0.22em] text-white sm:text-base">
            {t("home.mottoRef")}
          </p>
          <p className="mt-2 max-w-3xl px-2 text-center text-sm italic leading-relaxed text-white sm:text-base">
            {t("home.mottoText")}
          </p>
          <p className="mt-8 max-w-md text-center text-xs font-medium uppercase tracking-[0.35em] text-white/80">
            {t("home.scrollHint")}
          </p>
        </div>
      </section>

      <section
        aria-label={t("home.cardsSectionLabel")}
        className="border-t border-sage-primary/30 py-16 sm:py-20"
      >
        <div className="mx-auto grid w-full max-w-[min(96rem,calc(100%-1rem))] grid-cols-1 justify-items-center gap-x-5 gap-y-10 px-2 py-2 sm:max-w-[min(96rem,calc(100%-1.25rem))] sm:gap-x-7 sm:gap-y-12 sm:px-3 lg:grid-cols-2 lg:justify-items-stretch lg:gap-x-[clamp(3rem,8vw,6.5rem)] lg:gap-y-10 lg:px-4 xl:max-w-[min(100rem,calc(100%-1.5rem))] xl:gap-x-[clamp(3.5rem,9vw,8rem)] xl:px-5">
          {HOME_CARDS.map((card) => (
            <HomeFeatureCard key={card.to} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
