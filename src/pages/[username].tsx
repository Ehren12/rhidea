import NextError from "next/error";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as LZString from "lz-string";
import { signIn, signOut, useSession } from "next-auth/react";
const ProfilePage: NextPageWithLayout = () => {
	const { data: session } = useSession();
	const user: any = session?.user;
	 const profileQuery = trpc.useQuery(["profile.username"]);
	return (
		<>
		{user ? (
		<>
			<div className="h-11 w-11 rounded">
				<Link href={`/foodboy_010`}>
					<Image
						src={`${user.image}`}
						width={100}
						height={100}
						className="rounded-2xl cursor-pointer"
					/>
				</Link>
			</div>
			<h1>{user.name}</h1>
			<h1>@{profileQuery.data?.user}</h1>

		</>
		) : (
					<h1>nope</h1>
				)}
		</>
	);
};

export default ProfilePage;
