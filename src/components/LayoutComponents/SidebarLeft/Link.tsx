import Head from "next/head";
import { ReactElement, ReactNode, useState } from "react";
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
	GearSix
} from "phosphor-react";

type DefaultLayoutProps = { href: string, linktext: string, children: ReactNode  };

export const SidebarLink = ({href,linktext, children}: DefaultLayoutProps) => {
	const [open, setOpen] = useState(true);
	const { data: session } = useSession();
	const user: any = session?.user;
	return (
		
		<Link href={href}>
			<a
				className={`flex items-center border-0 hover:bg-gray-light/30 focus:outline-none active:bg-gray rounded-r-full text-base mt-4 md:mt-0 duration-300 w-full h-10 px-5 py-4 
				`}
			>
				{children}
				<div className="mr-12 pl-4 w-1/2">
					<p className="text-lg text-border-dark/80 mr-auto subpixel-antialiased font-medium">{linktext}</p>
				</div>
			</a>
		</Link>

	);
};
