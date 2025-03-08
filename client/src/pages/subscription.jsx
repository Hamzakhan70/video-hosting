import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    fetchSubscribedChannels, fetchSubscribers,
    toggleSubscription,
} from "@/store/slices/subscription/subscriptionSlice";

const SubscriptionPage = ({ userId, channelId }) => {
    const dispatch = useDispatch();
    const { subscribedChannels, subscribers, loading, error } = useSelector(
        (state) => state.subscription
    );
    const { user } = useSelector(       (state) => state.auth    );

    useEffect(() => {
        if (user._id) {
            dispatch(fetchSubscribedChannels(user._id));
        }
        if (user._id) {
            dispatch(fetchSubscribers(user._id));
        }
    }, [dispatch, userId, channelId]);

    const handleToggleSubscription = (id) => {
        dispatch(toggleSubscription(id));
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Subscriptions</h2>

            {loading && <Loader2 className="animate-spin mx-auto" size={24} />}

            {error && <p className="text-red-500">{error}</p>}

            {/* Subscribed Channels */}
            <Card className="mb-6">
                <CardContent>
                    <h3 className="text-lg font-semibold">Your Subscribed Channels</h3>
                    {subscribedChannels.length > 0 ? (
                        subscribedChannels.map((channel) => (
                            <div
                                key={channel._id}
                                className="flex items-center justify-between border-b py-2"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={channel.avatar}
                                        alt={channel.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold">{channel.name}</p>
                                        <p className="text-sm text-gray-500">{channel.email}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => handleToggleSubscription(channel._id)}
                                >
                                    Unsubscribe
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 mt-2">No subscriptions yet.</p>
                    )}
                </CardContent>
            </Card>

            {/* Subscribers */}
            {channelId && (
                <Card>
                    <CardContent>
                        <h3 className="text-lg font-semibold">Your Subscribers</h3>
                        {subscribers.length > 0 ? (
                            subscribers.map((subscriber) => (
                                <div
                                    key={subscriber.subscriber._id}
                                    className="flex items-center gap-3 border-b py-2"
                                >
                                    <img
                                        src={subscriber.subscriber.avatar}
                                        alt={subscriber.subscriber.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold">{subscriber.subscriber.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {subscriber.subscriber.email}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 mt-2">No subscribers yet.</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SubscriptionPage;
