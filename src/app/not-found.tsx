import Link from "next/link";
import { Arrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-brand text-white">
      <div className="container-x pt-24">
        <p className="eyebrow text-white/60">Gabim 404</p>
        <h1 className="display mt-5 text-[3rem] md:text-[5rem]">Faqja nuk u gjet</h1>
        <p className="mt-4 max-w-lg text-white/75">Faqja që kërkuat nuk ekziston ose është zhvendosur.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn bg-white text-brand hover:bg-stone">
            Kthehu në ballinë <Arrow />
          </Link>
          <Link href="/projektet/" className="btn border-white/50 text-white hover:border-white">
            Projektet
          </Link>
        </div>
      </div>
    </section>
  );
}
