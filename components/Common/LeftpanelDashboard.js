import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import avatar from "../../public/images/team/team-01.jpg";

import UserMenuItems from "../Header/HeaderProps/UserMenuItems";

import HeaderData from "../../data/header.json";
import { useAppContext } from "@/context/Context";

const LeftpanelDashboard = () => {
  const router = useRouter();
  const { shouldCollapseLeftbar } = useAppContext();

  const isActive = (href) => router.pathname === href;

  return (
    <>
      <div
        className={`rbt-left-panel popup-dashboardleft-section ${
          shouldCollapseLeftbar ? "collapsed" : ""
        }`}
      >
        <div className="rbt-default-sidebar">
          <div className="inner">
            <div className="content-item-content">
              <div className="rbt-default-sidebar-wrapper">
                <nav className="mainmenu-nav">
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li>
                      <Link
                        className={isActive("/dashboard") ? "active" : ""}
                        href="/dashboard"
                      >
                        <i className="feather-monitor"></i>
                        <span>Welcome</span>
                      </Link>
                    </li>
                  </ul>
                  <div className="rbt-sm-separator"></div>
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    {HeaderData &&
                      HeaderData.leftPanel.slice(0, 7).map((data, index) => (
                        <li key={index}>
                          <Link
                            href={data.link}
                            className={
                              isActive(data.link)
                                ? "active"
                                : `${data.isDisable ? "disabled" : ""}`
                            }
                          >
                            <Image
                              src={data.img}
                              width={35}
                              height={35}
                              alt="AI Generator"
                            />
                            <span>{data.title}</span>
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
                </nav>
                <div className="rbt-sm-separator"></div>
              </div>
            </div>
          </div>

          <p className="subscription-copyright copyright-text text-center b4  small-text">
            Copyright © 2024
          </p>
        </div>
      </div>
    </>
  );
};

export default LeftpanelDashboard;
