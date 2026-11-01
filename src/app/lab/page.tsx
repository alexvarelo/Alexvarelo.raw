"use client";

/*
 * Design lab: compare navbar and hero explorations live.
 * Not linked from the site — open /lab directly. Delete once a direction is chosen.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/components/lab/lab.css";
import { NAVBARS } from "@/components/lab/navbars";
import { HEROES } from "@/components/lab/heroes";
import { useGetUserPhotos } from "@/apis/generated/unsplashApi";
import { APP_CONFIG } from "@/constants/app";
import { POPULAR_PAGE_SIZE } from "@/app/landing/Landing";

type NavId = (typeof NAVBARS)[number]["id"];
type HeroId = (typeof HEROES)[number]["id"];

export default function LabPage() {
  const [nav, setNav] = useState<NavId>("pill");
  const [hero, setHero] = useState<HeroId>("reveal");
  const [replay, setReplay] = useState(0);

  // Same query as the home gallery, usually already cached
  const { data: photos = [] } = useGetUserPhotos(APP_CONFIG.unsplash.username, {
    page: 1,
    per_page: POPULAR_PAGE_SIZE,
    order_by: "popular",
    stats: true,
  });

  // Keep the selection in the URL so a combination can be shared or reloaded
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const n = q.get("nav");
    const h = q.get("hero");
    if (NAVBARS.some((x) => x.id === n)) setNav(n as NavId);
    if (HEROES.some((x) => x.id === h)) setHero(h as HeroId);
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      window.history.replaceState(null, "", `/lab?nav=${nav}&hero=${hero}`);
  }, [ready, nav, hero]);

  const Nav = NAVBARS.find((x) => x.id === nav)!.Component;
  const Hero = HEROES.find((x) => x.id === hero)!.Component;

  return (
    <div className="lab-page">
      <Nav key={nav} />
      <Hero key={`${hero}-${replay}`} photos={photos} />

      <section className="avr-section lab-filler">
        <p className="avr-overline">
          Scroll to test sticky / auto-hide navbars
        </p>
        <div className="avr-masonry" style={{ marginTop: 16 }}>
          {photos.map((p) => (
            <Link
              key={p.id}
              href={`/image/${p.id}`}
              className="avr-masonry__item"
              style={{
                background: p.color,
                aspectRatio: `${p.width} / ${p.height}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.urls?.small}
                alt={p.alt_description ?? ""}
                width={p.width}
                height={p.height}
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </section>

      <div className="lab-switcher" role="group" aria-label="Design lab">
        <label>
          <span>Navbar</span>
          <select value={nav} onChange={(e) => setNav(e.target.value as NavId)}>
            {NAVBARS.map((x, i) => (
              <option key={x.id} value={x.id}>
                {i + 1}. {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Hero</span>
          <select
            value={hero}
            onChange={(e) => setHero(e.target.value as HeroId)}
          >
            {HEROES.map((x, i) => (
              <option key={x.id} value={x.id}>
                {i}. {x.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setReplay((r) => r + 1)}
          title="Replay hero animation"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
