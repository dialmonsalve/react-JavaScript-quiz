import { Button } from "@mui/material";
import { useQuestionData } from "../hooks/useQuestionData";
import { useQuestionsStore } from "../store/questions";

export const Footer = () => {
	const { correct, incorrect, unanswered } = useQuestionData();
	const reset = useQuestionsStore(state=>state.reset)

	const totalCorrectas = correct === 1 ? "correcta" : "correctas";
	const totalIncorrectas = incorrect === 1 ? "incorrecta" : "incorrectas";

	return (
		<footer style={{ marginTop: "16px" }}>
			<strong>
				{" "}
				✅ {correct} {totalCorrectas} - ❌ {incorrect} {totalIncorrectas} - ❓{" "}
				{unanswered} sin responder{" "}
			</strong>
			<div style={{marginTop: '16px'}} >
			<Button onClick={()=>reset()} >
				Reset juego
			</Button>
			</div>
		</footer>
	);
};
