import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addNewVideo, fetchVideos } from "@/store/slices/video/video_slice";
import { Textarea } from "@/components/ui/textarea";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { videos, loading } = useSelector((state) => state.video);
    const { user } = useSelector((state) => state.auth);
    const [newVideoTitle, setNewVideoTitle] = useState("");
    const [newVideoDescription, setNewVideoDescription] = useState("");
    const [newVideoFile, setNewVideoFile] = useState("");
    const [newThumbnail, setNewThumbnail] = useState("");
    const [activeTab, setActiveTab] = useState("videos");

    useEffect(() => {
        dispatch(fetchVideos(user._id)); // Load user data & videos with userId
    }, [dispatch, user._id]);

    const handleAddVideo = async () => {
        if (!newVideoTitle || !newVideoDescription) return alert("Please enter all details");
        dispatch(addNewVideo({  title:newVideoTitle,description:newVideoDescription, thumbnail:newThumbnail,videoFile:newVideoFile }));
        setNewVideoTitle("");
        setNewVideoDescription("");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* User Profile */}
                    <Card>
                    
                        <div
                            className="h-40 bg-cover bg-center rounded-t-lg"
                            style={{ backgroundImage: `url(${user.coverImage})` }}
                        ></div>
                        <h2 className="p-2 text-xl font-bold">{user.fullName}'s Channel</h2>
                        <CardContent className="flex items-center p-4">
                            <img
                                src={user.avatar}
                                alt="User Profile"
                                className="w-20 h-20 rounded-full border-4 border-white -mt-10"
                            />
                            <div className="ml-4">
                                <h2 className="text-xl font-bold">{user.username}</h2>
                                <p className="text-gray-600">{user.email}</p>
                                <div className="flex mt-2 space-x-4">
                                    
                                    <span className="text-sm text-gray-700">
                                        <strong>{user.subscribersCount}</strong> Subscribers
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        <strong>{user.subscribedChannelsCount}</strong> Subscribed Channels
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                        <TabsList>
                            <TabsTrigger value="videos">All Videos</TabsTrigger>
                            <TabsTrigger value="add">Add Video</TabsTrigger>
                        </TabsList>

                        {/* All Videos */}
                        <TabsContent value="videos">
                            <h3 className="text-lg font-bold mt-4">Your Videos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {videos.length === 0 ? (
                                    <p>No videos found.</p>
                                ) : (
                                    videos.map((video) => (
                                        <Card key={video._id}>
                                            <CardContent className="p-4">
                                                <h4 className="font-semibold">{video.title}</h4>
                                                <video className="w-full mt-2" controls>
                                                    <source src={video.videoFile} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>
                        {/* Add Video */}
                        <TabsContent value="add">
                            <h3 className="text-lg font-bold mt-4">Add New Video</h3>
                            <Card className="mt-4">
                                <CardContent className="p-4">
                                    {/* Title Input */}
                                    <div className="mt-2">
                                        <label className="block font-medium">Upload Video</label>
                                        <Input
                                            type="text"
                                            placeholder="Video Title"
                                            value={newVideoTitle}
                                            onChange={(e) => setNewVideoTitle(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    {/* Description Input */}
                                    <div className="mt-2">
                                        <label className="block font-medium">Upload Video</label>
                                        <Textarea
                                            placeholder="Video Description"
                                            value={newVideoDescription}
                                            onChange={(e) => setNewVideoDescription(e.target.value)}
                                            className="w-full mt-2"
                                        />
                                    </div>
                                    {/* Video File Upload */}
                                    <div className="mt-2">
                                        <label className="block font-medium">Upload Video</label>
                                        <Input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setNewVideoFile(e.target.files[0])}
                                            className="w-full mt-2"
                                        />
                                    </div>

                                    {/* Thumbnail Upload */}
                                    <div className="mt-2">
                                        <label className="block font-medium">Upload Thumbnail</label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setNewThumbnail(e.target.files[0])}
                                            className="w-full mt-2"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button onClick={handleAddVideo} className="mt-4 bg-gray-500">
                                        Upload Video
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </>
            )}
        </div>
    );
};

export default Dashboard;
