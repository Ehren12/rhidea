import Head from "next/head";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import {
	House,
	List,
	X,
	ArrowCircleRight,
	SignIn,
	SignOut,
	RocketLaunch,
	Tray,
	TrendUp,
	GearSix,
} from "phosphor-react";
import { SidebarLink } from "./Link";

type DefaultLayoutProps = { children: ReactNode };

export const SidebarLeft = () => {
	const [open, setOpen] = useState(true);
	const { data: session } = useSession();
	const user: any = session?.user;
	return (
		<nav
			className={`md:ml-auto sticky left-0 top-0 h-screen pr-5 pt-2 ${
				open ? "w-72" : "w-16"
			} duration-300 border-r border-gray-400/5`}
		>
			<Link href="/">
				<a className="flex items-center md:mt-0 h-10 rounded-full w-fit px-5">
					<Image
						src="/rhidea.svg"
						alt="Picture of the author"
						width={30}
						height={30}
					/>
				</a>
			</Link>

			{user ? (
				<div className="flex flex-col space-y-7 w-full mt-24">
					<SidebarLink href="/" linktext={"Home"}>
						<House
							size={28}
							weight="thin"
							className="font-t cursor-pointer duration-300 text-border-dark/80 mr-auto"
						/>
					</SidebarLink>
					<SidebarLink href="#" linktext={"Explore"}>
						<RocketLaunch
							size={28}
							weight="thin"
							className="font-t cursor-pointer duration-300 text-border-dark/80 mr-auto"
						/>
					</SidebarLink>
					<SidebarLink href="#" linktext={"Inbox"}>
						<Tray
							size={28}
							weight="thin"
							className="font-t cursor-pointer duration-300 text-border-dark/80 mr-auto"
						/>
					</SidebarLink>
					<SidebarLink href="#" linktext={"Trending"}>
						<TrendUp
							size={28}
							weight="thin"
							className="font-t cursor-pointer duration-300 text-border-dark/80 mr-auto"
						/>
					</SidebarLink>
					<div className="pt-20">
						<Link href="#settings">
							<a
								className={`flex items-center border-0 focus:outline-none rounded text-base mt-4 md:mt-0  duration-300 h-10 w-fit px-2 ${
									open && "w-fit px-2"
								}`}
							>
								<GearSix
									size={28}
									weight="thin"
									className="cursor-pointer duration-300 text-border-dark/80 m-auto"
								/>
							</a>
						</Link>
					</div>

					<button onClick={() => signOut()}>
						<a className="border-0 focus:outline-none rounded text-base mt-4 md:mt-0">
							<SignOut
								size={30}
								weight="thin"
								className="cursor-pointer duration-300 text-border-dark/80 "
							/>
						</a>
					</button>
				</div>
			) : (
				<>
					<h1> Sign in </h1>
					<button onClick={() => signIn()}>
						<SignIn
							size={30}
							weight="light"
							className="text-border-dark/80 pl-5"
						/>
					</button>
				</>
			)}
		</nav>
	);
};
