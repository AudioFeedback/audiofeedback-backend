import { PrismaClient, Role, Track, User } from '@prisma/client'
import { fakerNL } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {
  const musicProducer1 = await createRandomUser(Role.MUZIEKPRODUCER, "muziekproducer");

  const PhonHouseBeatTrack = await addTrackToMusicProducer(musicProducer1, PhonHouseBeat);
  const WatrByYourSideTrack = await addTrackToMusicProducer(musicProducer1, WatrByYourSide);
  const FuturisticBeatTrack = await addTrackToMusicProducer(musicProducer1, FuturisticBeat);

  const musicroducer2 = await createRandomUser(Role.MUZIEKPRODUCER);

  const EmbraceTrack = await addTrackToMusicProducer(musicroducer2, Embrace);
  const ModernVlogTrack = await addTrackToMusicProducer(musicroducer2, ModernVlog);


  const feedbackgever1 = await createRandomUser(Role.FEEDBACKGEVER, "feedbackgever");
  await addFeedbackToTrack(createRandomFeedback(), PhonHouseBeatTrack, feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack, feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack, feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack, feedbackgever1)

  const feedbackgever2= await createRandomUser(Role.FEEDBACKGEVER);
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack, feedbackgever2)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack, feedbackgever2)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack, feedbackgever2)


  const feedbackgever3 = await createRandomUser(Role.FEEDBACKGEVER);
  await addFeedbackToTrack(createRandomFeedback(), PhonHouseBeatTrack, feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack, feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack, feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack, feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), ModernVlogTrack, feedbackgever3)
}


function createRandomUser(role: Role, username?: string): Promise<User> {
  const data = {
    username: username ? username : fakerNL.internet.userName(),
    firstname: fakerNL.person.firstName(),
    password: "demo123",
    lastname: fakerNL.person.lastName(),
    role: role,
  }

  return prisma.user.create({data});
}

function createRandomFeedback(): FeedbackData {
  return {
    rating: fakerNL.datatype.boolean(),
    comment: fakerNL.lorem.lines({min: 1, max: 1}),
    timestamp: fakerNL.number.float({ precision: 0.1, max: 1 })
  }
}

function addTrackToMusicProducer(user: User, track: TrackData) {
  return prisma.track.create({
    data: {
      ...track,
      author: {
        connect: user
      }
    }
  })
}

function addFeedbackToTrack(feedback: FeedbackData, track: Track, user: User) {
  return prisma.feedback.create({
    data: {
      ...feedback,
      track: {
        connect: track
      },
      user: {
        connect: user
      }
    }
  })
}

interface TrackData {
  title: string;
  genre: string;
  guid: string;
  filetype: string;
}

interface FeedbackData {
  rating: boolean;
  comment: string;
  timestamp: number;
}

// Zie folder discord, importeer deze in de folder /audio

const PhonHouseBeat = {
  title: "Phonk House Beat (You Wanna Play)",
  genre: "Fonk",
  guid: "phonk-house-beat-you-wanna-play-126321",
  filetype: "mp3",
}

const WatrByYourSide = {
  title: "WatR. - By Your Side",
  genre: "House",
  guid: "watr-by-your-side-11516",
  filetype: "mp3",
}

const FuturisticBeat = {
  title: "Futuristic Beat",
  genre: "Trap",
  guid: "futuristic-beat-146661",
  filetype: "mp3",
}

const Embrace = {
  title: "Embrace",
  genre: "Uplifting",
  guid: "embrace-12278",
  filetype: "mp3",
}

const ModernVlog = {
  title: "Modern Vlog",
  genre: "Future Bass",
  guid: "modern-vlog-140795",
  filetype: "mp3",
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})