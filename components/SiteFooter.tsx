import Link from "next/link";
import { site } from "@/content/site";
import { Slogan } from "@/components/Slogan";
import { SocialIcon } from "@/components/SocialIcon";

export function SiteFooter() {
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <h2>North London Driving School</h2>
            <Slogan variant="small" />
            <p>
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region}{" "}
              {site.address.postalCode}
            </p>
            <p>
              <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <ul className="footer__social">
              <li>
                <a href={site.phone.whatsapp} target="_blank" rel="noopener">
                  <SocialIcon name="whatsapp" />
                  WhatsApp
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener">
                  <SocialIcon name="instagram" />
                  Instagram
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2>Course</h2>
            <ul>
              <li>
                <Link href="/packages">Packages and pricing</Link>
              </li>
              <li>
                <Link href="/how-it-works">How it works</Link>
              </li>
              <li>
                <Link href="/free-resources">Free resources</Link>
              </li>
              <li>
                <Link href="/faq">Frequently asked questions</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2>School</h2>
            <ul>
              <li>
                <Link href="/about-us">About us</Link>
              </li>
              <li>
                <Link href="/areas-we-serve">Areas we serve</Link>
              </li>
              <li>
                <Link href="/contact">Contact us</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2>Office hours</h2>
            <p>
              Monday to Sunday
              <br />
              8:00am to 8:00pm
            </p>
            <p>
              Coursework is available online at any time through{" "}
              <a href={site.external.trubicars} rel="noopener">
                TruBiCars
              </a>
              .
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} North London Driving School</span>
          <span>
            Beginner Driver Education approved by the Ontario Ministry of
            Transportation
          </span>
        </div>
      </div>
    </footer>
  );
}
