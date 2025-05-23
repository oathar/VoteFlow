const User = require("../models/User");
const Poll = require("../models/Poll");

//Create New Poll
exports.createPoll = async (req, res) => {
    const { question, type, options, creatorId } = req.body;

    if (!question || !type || !creatorId) {
        return res
            .status(400)
            .json({ message: "Question, type and creatorId are required." });
    }

    try {
        let processedOptions = [];
        switch (type) {

            case "single-choice":
                if (!options || options.length < 2) {
                    return res.status(400).json({
                        message: "Single-choice poll must have at least two options."
                    });
                }
                processedOptions = options.map((option) => ({ optionText: option }));
                break;

            case "rating":
                processedOptions = [1, 2, 3, 4, 5].map((value) => ({
                    optionText: value.toString(),
                }));
                break;

            case "yes/no":
                processedOptions = ["Yes", "No"].map((option) => ({
                    optionText: option,
                }));
                break;

            case "image-based":
                if (!options || options.length < 2) {
                    return res.status(400).json({
                        message: "Image-based poll must have at least two image URLs.",
                    });
                }
                processedOptions = options.map((url) => ({ optionText: url }));
                break;

            case "open-ended":
                processedOptions = []
                break;

            default:
                return res.status(400).json({ message: "Invalid poll type." });

        }
        const newPoll = await Poll.create({
            question,
            type,
            options: processedOptions,
            creator: creatorId,
        });
        res.status(201).json(newPoll);

    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message })
    }
}

//Get All Polls
exports.getAllPolls = async (req, res) => {
    const { type, creatorId, page = 1, limit = 10 } = req.query;
    const filter = {};
    const userId = req.user._id;

    if (type) filter.type = type;
    if (creatorId) filter.creator = creatorId;

    try {
        // Calculate pagination parameters
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        // Fetch polls with pagination
        const polls = await Poll.find(filter)
            .populate("creator", "fullName username email profileImageUrl")
            .populate({
                path: "response.voterId",
                select: "username profileImageUrl fullName",
            })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        // Add `userHasVoted' flag for each poll
        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) =>
                voterId.equals(userId)
            );
            return {
                ...poll.toObject(),
                userHasVoted,
            };
        });

        // Get total count of polls for pagination metadata
        const totalPolls = await Poll.countDocuments(filter);

        const stats = await Poll.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        // Ensure all types are included in stats, even those with zero counts
        const allTypes = [
            { type: "single-choice", label: "Single Choice" },
            { type: "yes/no", label: "Yes/No" },
            { type: "rating", label: "Rating" },
            { type: "image-based", label: "Image Based" },
            { type: "open-ended", label: "Open Ended" },
        ];
        const statsWithDefaults = allTypes
            .map((pollType) => {
                const stat = stats.find((item) => item.type === pollType.type);
                return {
                    label: pollType.label,
                    type: pollType.type,
                    count: stat ? stat.count : 0,
                };

            })
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
            stats: statsWithDefaults,
        });



    }

    catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message })

    }


}

//Get All Voted Polls
exports.getVotedPolls = async (req, res) => {
    res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
}

//Get Poll by ID
exports.getPollById = async (req, res) => {
    res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
}

//Vote Poll

exports.voteOnPoll = async (req, res) => {
const { id } = req.params;
const { optionIndex, voterId, responseText } = req.body;
 try{
     const poll = await Poll.findById(id);
if (!poll) {
return res.status(404) . json({ message: "Poll not found" });}

if (poll.closed) {
return res.status(400).json({ message: "Poll is closed." });

}

if (poll.voters. includes(voterId) ) {
return res
.status(400)
.json({ message: "User has already voted on this poll." });}

if (poll.type === "open-ended"){
if (!responseText) {
return res
.status(400)
.json({ message: "Response text is required for open-ended polls." });
}
poll.responses.push({voterId, responseText});

}else{
    if(
        optionIndex === undefined ||
        optionIndex < 0 ||
        optionIndex >= poll.options.length
    ){
       return res.status(400).json({message: "Invalid option index."});
    }
    poll.options[optionIndex].votes += 1;

}
poll.voters.push(voterId);
await poll.save();
res.status(200).json(poll);
 
    } catch(err){
         res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
    }
    
};

//ClosePoll
exports.closePoll = async (req, res) => {
    res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
}

//Bookmark Poll
exports.bookmarkPoll = async (req, res) => {
    res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
}

//Get All Bookmark Polls
exports.getBookmarkedPolls = async (req, res) => {
    res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
}

//Delete Poll
exports.deletePoll = async (req, res) => {
    res
        .status(500)
        .json({ message: "Error registering user", error: err.message })
}