import Head from "next/head";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { trpc } from "../../../utils/trpc";
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

type DefaultLayoutProps = { children: ReactNode };

export const SidebarRight = () => {
	const [open, setOpen] = useState(false);
	const { data: session } = useSession();
	const user: any = session?.user;
	const today = new Date();
	const curHr = today.getHours();
	const profileByEmail = trpc.useQuery(["profile.findByEmail", {email: user?.email}])
	const profileData = profileByEmail.data;
	const profileQuery = trpc.useQuery(["profile.user_profile", {username: profileData?.username}]);

	if (curHr < 12) {
		console.log("good morning");
	} else if (curHr < 18) {
		console.log("good afternoon");
	} else {
		console.log("good evening");
	}
	const morning_statements = [
		"Hi 👋",
		"Good morning 🍃",
		"Have you had breakfast 🍳",
		"Ready to make an Idea 🧐",
	];
	const afternoon_statements = [
		"Sup ✌",
		"Good afternoon 🔅",
		"Got any ideas this afternoon",
		"How's the afternoon going ⛷",
	];
	const evening_statements = [
		"Hello 🙋",
		"Good evening 🕕",
		"Any ideas this evening 📏‍",
		"How was your day 🍕",
	];

	function randomWord(arr: any) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	return (
		<nav
			className={`md:ml-auto sticky left-0 top-0 h-screen w-96 duration-300 border-l border-gray-400/5`}
		>
			<div className="h-14 border-b border-gray-400/5 flex items-center px-3 flex-row space-x-2 hover:shadow-lg hover:shadow-border-dark/3">
				{user ? (
					<>
						<div className="h-11 w-11 rounded">
						<Link href={`/${profileQuery.data?.username}`}>
							<Image
								src={`${user?.image}`}
								width={100}
								height={100}
								className="rounded-2xl cursor-pointer"
							/>
							</Link>
						</div>
						<div className="flex flex-col space-y-0">
							<h4 className="text-xs opacity-30 antialiased font-bold">
								{curHr < 12
									? randomWord(morning_statements)
									: curHr < 18
									? randomWord(afternoon_statements)
									: randomWord(evening_statements)}
							</h4>
							<Link href={`/${profileQuery.data?.username}`}>
							<h1 className="text-lg antialiased font-medium  h-fit cursor-pointer">
								<a>{user.name}</a>
							</h1>
							</Link>
						</div>
					</>
					
				) : (
					<h1>nope</h1>
				)}
			</div>
		</nav>
	);
};
