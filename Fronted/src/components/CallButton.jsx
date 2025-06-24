import { Video } from "lucide-react";
function CallButton({ handleVideoCall }) {
  return (
    <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
      <Video className="size-5" />
    </button>
  );
}

export default CallButton;
