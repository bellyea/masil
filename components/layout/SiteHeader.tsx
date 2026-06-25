import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/app/actions/auth-actions";
import SiteNav from "./SiteNav";

function Logo() {
  return (
    <span className="brand-logo" aria-label="마실 홈">
      <span className="brand-logo__mark" aria-hidden="true">
        ㅁ
      </span>
      <span className="brand-logo__text">
        <strong>마실</strong>
        <small>masil</small>
      </span>
    </span>
  );
}

export default async function SiteHeader() {
  const session = await auth();
  const userLabel = session?.user?.nickname ?? session?.user?.name ?? "마실러";

  return (
    <header className="site-header">
      <div className="site-header__inner masil-shell">
        <Link href="/" className="site-header__brand" aria-label="마실 홈으로 이동">
          <Logo />
        </Link>

        <SiteNav />


        <div className="site-header__auth">
          {session?.user ? (
            <>
              <span className="site-header__user">{userLabel}</span>
              <form action={logout}>
                <button type="submit">Logout</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="site-header__login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

