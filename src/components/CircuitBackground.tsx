"use client";

import { useEffect, useRef } from "react";

type DataPoint = {
	x: number;
	y: number;
	radius: number;
	phase: number;
	speed: number;
	tone: number;
};

const BINARY = "0100110110100101101001011010011010010110";

export default function CircuitBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d", { alpha: false });
		if (!canvas || !context) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
		const mobile = window.matchMedia("(max-width: 700px)").matches;
		const touchStart = { x: 0, y: 0 };
		let touchOffsetX = 0;
		let touchOffsetY = 0;
		const binaryCount = mobile ? 12 : 28;
		const dataPoints: DataPoint[] = Array.from({ length: mobile ? 22 : 58 }, () => ({
			x: Math.random(),
			y: Math.random(),
			radius: 0.45 + Math.random() * 1.1,
			phase: Math.random() * Math.PI * 2,
			speed: 0.15 + Math.random() * 0.38,
			tone: Math.random(),
		}));

		let width = 0;
		let height = 0;
		let pixelRatio = 1;
		let frame = 0;
		let lastDrawAt = 0;
		let scrollY = window.scrollY;
		let targetScrollY = scrollY;
		const sceneRoot = document.querySelector<HTMLElement>(".cyber-site");
		const sceneVariables = ["--hero-shield-x", "--hero-shield-y", "--hero-shield-scale", "--hero-shield-rotate", "--title-rotate-x", "--title-rotate-y"];
		const originalSceneVariables = new Map(sceneVariables.map((name) => [name, sceneRoot?.style.getPropertyValue(name) ?? ""]));

		const resize = () => {
			pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.round(width * pixelRatio);
			canvas.height = Math.round(height * pixelRatio);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		};

		const setPointerTarget = (x: number, y: number) => {
			pointer.targetX = Math.max(-1, Math.min(1, x));
			pointer.targetY = Math.max(-1, Math.min(1, y));
		};

		const handlePointerDown = (event: PointerEvent) => {
			if (event.pointerType !== "touch") return;

			touchStart.x = event.clientX;
			touchStart.y = event.clientY;
		};

		const handlePointer = (event: PointerEvent) => {
			if (event.pointerType === "touch") {
				const dx = event.clientX - touchStart.x;
				const dy = event.clientY - touchStart.y;

				touchOffsetX = Math.max(-1, Math.min(1, dx / (width * 0.35)));
				touchOffsetY = Math.max(-1, Math.min(1, dy / (height * 0.35)));

				setPointerTarget(touchOffsetX, touchOffsetY);
				return;
			}

			setPointerTarget(
				(event.clientX / width - 0.5) * 2,
				(event.clientY / height - 0.5) * 2,
			);
		};

		const handleScroll = () => {
			targetScrollY = window.scrollY;
		};

		const draw = (timestamp: number) => {
			frame = window.requestAnimationFrame(draw);
			if (timestamp - lastDrawAt < 28) return;
			const elapsedMs = lastDrawAt ? Math.min(timestamp - lastDrawAt, 80) : 28;
			lastDrawAt = timestamp;

			const time = reducedMotion ? 0 : timestamp * 0.00012;
			const pointerEase = reducedMotion ? 1 : 1 - Math.exp(-elapsedMs / 180);
			pointer.x += (pointer.targetX - pointer.x) * pointerEase;
			pointer.y += (pointer.targetY - pointer.y) * pointerEase;
			scrollY += (targetScrollY - scrollY) * (reducedMotion ? 1 : 1 - Math.exp(-elapsedMs / 240));
			const scrollRange = Math.max(1, document.documentElement.scrollHeight - height);
			const scrollProgress = Math.max(0, Math.min(1, scrollY / scrollRange));
			const parallaxRange = mobile ? 12 : 28;
			const binaryX = pointer.x * parallaxRange * 0.15;
			const binaryY = pointer.y * parallaxRange * 0.15;
			const particleX = pointer.x * parallaxRange * 0.25;
			const particleY = pointer.y * parallaxRange * 0.25;
			const circuitX = pointer.x * parallaxRange * 0.35;
			const circuitY = pointer.y * parallaxRange * 0.35;
			const ringX = pointer.x * parallaxRange * 0.45;
			const ringY = pointer.y * parallaxRange * 0.45;
			const shieldX = pointer.x * parallaxRange * 0.55;
			const shieldY = pointer.y * parallaxRange * 0.55;
			const glowX = pointer.x * parallaxRange * 0.7;
			const glowY = pointer.y * parallaxRange * 0.7;
			if (sceneRoot) {
				sceneRoot.style.setProperty("--hero-shield-x", `${shieldX}px`);
				sceneRoot.style.setProperty("--hero-shield-y", `${shieldY - scrollProgress * 56}px`);
				sceneRoot.style.setProperty("--hero-shield-scale", `${1 - scrollProgress * 0.045}`);
				sceneRoot.style.setProperty("--hero-shield-rotate", `${pointer.x * 0.7 + scrollProgress * 1.6}deg`);
				sceneRoot.style.setProperty("--title-rotate-x", `${-pointer.y * 2.2 - scrollProgress * 1.5}deg`);
				sceneRoot.style.setProperty("--title-rotate-y", `${pointer.x * 3.2 * 0.6 + scrollProgress * 1.8}deg`);
			}

			context.fillStyle = "#030508";
			context.fillRect(0, 0, width, height);

			const backgroundX = pointer.x * parallaxRange * 0.08;
			const backgroundY = pointer.y * parallaxRange * 0.08 - Math.min(scrollY * 0.004, 38);
			const midgroundX = ringX;
			const midgroundY = ringY - Math.min(scrollY * 0.012, 95);
			const foregroundX = glowX;
			const foregroundY = glowY - Math.min(scrollY * 0.022, 155);
			const light = context.createRadialGradient(
				width * 0.63 + glowX + Math.sin(time * 0.32) * 22,
				height * 0.43 + glowY + Math.cos(time * 0.27) * 15 - scrollProgress * 22,
				0,
				width * 0.63,
				height * 0.48,
				Math.max(width, height) * 0.72,
			);
			light.addColorStop(0, "rgba(0, 103, 176, 0.10)");
			light.addColorStop(0.42, "rgba(10, 43, 78, 0.055)");
			light.addColorStop(0.74, "rgba(111, 77, 29, 0.035)");
			light.addColorStop(1, "rgba(3, 5, 8, 0)");
			context.fillStyle = light;
			context.fillRect(0, 0, width, height);

			const gridSize = mobile ? 58 : 82;
			const offsetX = ((time * 4 + backgroundX) % gridSize + gridSize) % gridSize;
			const offsetY = ((time * 3 + backgroundY) % gridSize + gridSize) % gridSize;
			context.lineWidth = 1;
			context.strokeStyle = "rgba(65, 133, 173, 0.035)";
			context.beginPath();
			for (let x = -gridSize + offsetX; x < width + gridSize; x += gridSize) {
				context.moveTo(x, 0);
				context.lineTo(x, height);
			}
			for (let y = -gridSize + offsetY; y < height + gridSize; y += gridSize) {
				context.moveTo(0, y);
				context.lineTo(width, y);
			}
			context.stroke();

			const orbitX = width * 0.68 + midgroundX;
			const orbitY = height * 0.46 + midgroundY;
			const orbitRadius = Math.min(width * 0.41, height * 0.48);
			context.save();
			context.translate(orbitX, orbitY);
			context.rotate(time * 0.09 + scrollProgress * 0.12);
			[1, 0.76, 0.53].forEach((scale, index) => {
				context.beginPath();
				context.ellipse(0, 0, orbitRadius * scale, orbitRadius * scale * 0.82, index * 0.08 + time * (index % 2 ? -0.045 : 0.06), 0.24 + index * 0.35, Math.PI * 1.72 + index * 0.24);
				context.strokeStyle = index === 1 ? "rgba(0, 191, 255, 0.085)" : "rgba(214, 168, 79, 0.07)";
				context.lineWidth = index === 0 ? 1 : 0.7;
				context.stroke();
			});
			context.restore();

			context.save();
			context.translate(circuitX, circuitY - Math.min(scrollY * 0.009, 72));
			context.strokeStyle = "rgba(0, 191, 255, 0.075)";
			context.lineWidth = 0.75;
			for (let index = 0; index < 9; index += 1) {
				const routeX = ((index * 197 + 63) % (width + 160)) - 80;
				const routeY = ((index * 131 + time * (18 + index % 3 * 5) - scrollY * 0.012) % (height + 120)) - 60;
				context.beginPath();
				context.moveTo(routeX, routeY);
				context.lineTo(routeX + 26 + index % 4 * 9, routeY);
				context.lineTo(routeX + 26 + index % 4 * 9, routeY + 22 + index % 3 * 11);
				context.lineTo(routeX + 86 + index % 4 * 13, routeY + 22 + index % 3 * 11);
				context.strokeStyle = index % 3 === 0 ? "rgba(214, 168, 79, 0.055)" : "rgba(0, 191, 255, 0.065)";
				context.stroke();
				context.beginPath();
				context.arc(routeX + 86 + index % 4 * 13, routeY + 22 + index % 3 * 11, 1.2, 0, Math.PI * 2);
				context.fillStyle = "rgba(0, 191, 255, 0.19)";
				context.fill();
			}
			context.restore();

			context.save();
			for (let index = 0; index < 3; index += 1) {
				const travel = reducedMotion ? 0 : (timestamp * (0.025 + index * 0.009) + index * width * 0.42) % (width + 260) - 130;
				const streakY = height * (0.25 + index * 0.24) + Math.sin(time * 0.22 + index) * 36 - scrollProgress * (14 + index * 10);
				const streak = context.createLinearGradient(travel - 90, streakY - 40, travel + 90, streakY + 40);
				streak.addColorStop(0, "rgba(0, 191, 255, 0)");
				streak.addColorStop(0.5, index === 2 ? "rgba(214, 168, 79, 0.12)" : "rgba(0, 191, 255, 0.15)");
				streak.addColorStop(1, "rgba(0, 191, 255, 0)");
				context.strokeStyle = streak;
				context.lineWidth = 1;
				context.beginPath();
				context.moveTo(travel - 85 + foregroundX, streakY - 32 + foregroundY * 0.3);
				context.lineTo(travel + 85 + foregroundX, streakY + 32 + foregroundY * 0.3);
				context.stroke();
			}
			context.restore();

			context.font = "8px IBM Plex Mono, monospace";
			context.textAlign = "center";
			for (let index = 0; index < binaryCount; index += 1) {
				const x = ((index + 0.5) / binaryCount) * width + Math.sin(time * 0.58 + index) * 7 + binaryX;
				const speed = 8 + (index % 5) * 3;
				const streamRows = Math.ceil(height / 18) + 1;
				const streamLength = (streamRows - 1) * 18;
				const streamCycle = height + streamLength;
				const streamOffset = time * speed * 40 + index * 47 + binaryY - scrollY * (0.015 + index % 4 * 0.004);
				const streamY = ((streamOffset % streamCycle) + streamCycle) % streamCycle - streamLength;
				context.fillStyle = index % 7 === 0 ? "rgba(214, 168, 79, 0.12)" : "rgba(0, 191, 255, 0.11)";
				for (let row = 0; row < streamRows; row += 1) {
					const charIndex = (index * 7 + row * 5) % BINARY.length;
					const y = streamY + row * 18;
					if (y > -10 && y < height + 10) context.fillText(BINARY[charIndex], x, y);
				}
			}

			dataPoints.forEach((point, index) => {
				const float = reducedMotion ? 0 : Math.sin(time * point.speed * 3 + point.phase) * 9;
				const x = point.x * width + particleX * (0.52 + point.tone) + float;
				const y = (point.y * height + particleY * (0.3 + point.tone) + float * 0.6 + timestamp * point.speed * 0.0012 - scrollY * (0.018 + point.tone * 0.01)) % height;
				context.beginPath();
				context.arc(x, y, point.radius, 0, Math.PI * 2);
				context.fillStyle = index % 9 === 0 ? "rgba(240, 201, 106, 0.48)" : "rgba(0, 191, 255, 0.38)";
				context.fill();
			});
		};

		resize();
		frame = window.requestAnimationFrame(draw);
		window.addEventListener("resize", resize);
		window.addEventListener("pointerdown", handlePointerDown, { passive: true });
		window.addEventListener("pointermove", handlePointer, { passive: true });
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("resize", resize);
			window.removeEventListener("pointerdown", handlePointerDown);
			window.removeEventListener("pointermove", handlePointer);
			window.removeEventListener("scroll", handleScroll);
			if (sceneRoot) {
				originalSceneVariables.forEach((value, name) => {
					if (value) sceneRoot.style.setProperty(name, value);
					else sceneRoot.style.removeProperty(name);
				});
			}
		};
	}, []);

	return <canvas ref={canvasRef} className="circuit-background" aria-hidden="true" />;
}

