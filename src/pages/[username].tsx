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
	// const userQuery = trpc.useQuery(["profile.user"])
	// const user_id: any = userQuery.data?.id
	const username = useRouter().query.username as string;
	// console.log(username)
	const profileQuery = trpc.useQuery(["profile.user_profile", { username }]);
	const data = profileQuery.data;

	return (
		<>
			{user && session ? (
				<>
					<div className="h-11 w-11 rounded">
						<Link href={`/${data?.username}`}>
							<Image
								src={`${data?.image}`}
								width={100}
								height={100}
								className="rounded-2xl cursor-pointer"
							/>
						</Link>
					</div>
					<h1>{data?.name}</h1>
					<h1>@{data?.username}</h1>
					<h1>Followers: {data?.followers}</h1>
					<h1>Following: {data?.following}</h1>
				</>
			) : (
				<h1>nope</h1>
			)}
		</>
	);
};

export default ProfilePage;
