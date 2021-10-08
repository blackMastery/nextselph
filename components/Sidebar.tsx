import { Box, Link as BLink, SideNav, Text } from "bumbag";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

interface SideNavItem {
  title: string;
  href: string;
  navId: string;
}

const basicSideNavItems: SideNavItem[] = [
  { href: "/dashboard", title: "Home", navId: "dashboard" },
  {
    href: "/analytics",
    title: "Analytics",
    navId: "analytics",
  },
];

const accountSideNavItems: SideNavItem[] = [
  {
    href: "/dashboard/manage-account",
    title: "Manage Account",
    navId: "manage-account",
  }
];

function Sidebar() {
  const router = useRouter();

  let thePath = router.pathname.split("/").filter(p=> p !== "");
  let qpath = thePath.reverse().pop()


  return (
    <div>
      <SideNav defaultSelectedId="home"  height="100vh" selectedId={qpath}>
        <Box textAlign="center" paddingY="minor-8">
          <Link href="/dashboard">
            <Box cursor="pointer" display="inline-block">
              <Image
                src="/logo-white.png"
                alt="White version of TrueSelph logo"
                width={120}
                height={45}
              ></Image>
            </Box>
          </Link>
        </Box>

        <SideNav.Level title="Dashboard">
          {basicSideNavItems.map((item) => (
            <Link href={item.href} key={item.navId}>
              <SideNav.Item navId={item.navId}>{item.title}</SideNav.Item>
            </Link>
          ))}

          {/* @ts-ignore */}
          <BLink href="https://bit.ly/3AMBHMF" target="_blank">
            <SideNav.Item navId="report-a-bug">Report a Bug</SideNav.Item>
          </BLink>
        </SideNav.Level>

        <SideNav.Level title="Account">
          {accountSideNavItems.map((item) => (
            <Link href={item.href} key={item.navId}>
              <SideNav.Item key={item.navId} navId={item.navId}>
                {item.title}
              </SideNav.Item>
            </Link>
          ))}
          <SideNav.Item
            navId="logout"
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
          >
            <Text color="#FBFBFB">Logout</Text>
          </SideNav.Item>
        </SideNav.Level>
      </SideNav>
    </div>
  );
}

export default Sidebar;
