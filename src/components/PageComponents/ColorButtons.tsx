import React, { useState, ReactNode, useRef } from "react";
import { Heart, HeartStraight, ChatCenteredDots } from "phosphor-react";
type LikeProps = { color: any; hex: any };
const ColorBtn = ({ color, hex }: LikeProps) => {
	const ref = useRef(null);
	const [select, setSelect] = useState(false);
	const [bgColor, setBgColor]: any = useState("");
	const handleColor = (value: string | any) => {
		(e: any) => {
			e.stopPropagation();
		};
		setBgColor(value.target.value);
		setSelect(!select);
		console.log(value.target.value);
	};
	return (
		<input
			type={"button"}
			name="bgColor"
			className={`cursor-pointer rounded-full w-8 h-8 bg-${color} hover:shadow-md hover:shadow-black/30 text-transparent ${
				select && "opacity-50"
			}`}
			value={`#${hex}`}
			onClick={handleColor}
		/>
	);
};

export default ColorBtn;
