import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuthStore } from "../store/UseAuthStore";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../utils/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = 'mvkdpsxfr5fy';

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isCheckingAuth } = UseAuthStore();
  
  const { data: tokenData, isLoading: isTokenLoading, error: tokenError } = useQuery({
    queryKey: ["streamToken", authUser?._id],
    queryFn: () => getStreamToken(authUser._id),
    enabled: !!authUser?._id,
  });

  // Debug logging
  useEffect(() => {
    console.log("Debug - tokenData:", tokenData);
    console.log("Debug - isTokenLoading:", isTokenLoading);
    console.log("Debug - tokenError:", tokenError);
    console.log("Debug - authUser:", authUser);
  }, [tokenData, isTokenLoading, tokenError, authUser]);

  useEffect(() => {
    const initCall = async () => {
      // Check if we have all required data
      console.log("initCall - Checking conditions:", {
        tokenData,
        hasToken: tokenData?.token,
        authUser: !!authUser,
        callId: !!callId,
        isTokenLoading
      });

      // Wait for token to load first
      if (isTokenLoading) {
        console.log("Still loading token...");
        return;
      }

      if (!tokenData || !authUser || !callId) {
        console.log("Missing required data, stopping initCall");
        setIsConnecting(false);
        return;
      }

      // tokenData is already the token string from your API function
      const token = tokenData;
      console.log("Using token:", token);

      try {
        console.log("Initializing Stream video client...");
        const user = {
          id: authUser._id,
          name: authUser.name, // Changed from fullName to name based on your auth object
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: token, // tokenData is already the token string
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        
        console.log("Joined call successfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser?._id, callId, isTokenLoading]); // Updated dependencies

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (call) {
        call.leave();
      }
      if (client) {
        client.disconnectUser();
      }
    };
  }, [call, client]);

  // Handle token error
  if (tokenError) {
    toast.error("Failed to get stream token");
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Failed to initialize call. Please try again.</p>
      </div>
    );
  }

  // Show loader while checking auth or connecting
  if (isCheckingAuth || isTokenLoading || isConnecting) {
    return <PageLoader />;
  }

  // Show error if no auth user
  if (!authUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Please log in to join the call.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;