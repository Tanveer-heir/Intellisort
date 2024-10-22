import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import SmallNavItem from "../../data/header.json";

const SmallNav = () => {
  const router = useRouter();

  const isActive = (href) => router.pathname === href;
  return (
    <>
      <nav className="mainmenu-nav">
        <ul className="dashboard-mainmenu rbt-default-sidebar-list">
          <li>
            <Link href="/dashboard">
              <i className="feather-monitor"></i>
              <span>Welcome</span>
            </Link>
          </li>
        </ul>
        <div className="rbt-sm-separator"></div>
        <ul className="dashboard-mainmenu rbt-default-sidebar-list">
          {SmallNavItem &&
            SmallNavItem.smallNavItem.slice(0, 7).map((data, index) => (
              <li key={index}>
                <Link
                  // className={data.isDisable ? "disabled" : ""}

                  className={
                    isActive(data.link)
                      ? "active"
                      : "" || data.isDisable
                      ? "disabled"
                      : ""
                  }
                  href={data.link}
                >
                  <Image
                    src={data.img}
                    width={35}
                    height={35}
                    alt="AI Generator"
                  />
                  <span>{data.text}</span>
                  {data.badge !== "" ? (
                    <div className="rainbow-badge-card badge-sm ml--10">
                      {data.badge}
                    </div>
                  ) : (
                    ""
                  )}
                </Link>
              </li>
            ))}
        </ul>
        <div className="rbt-sm-separator"></div>
      </nav>
    </>
  );
};

export default SmallNav;
