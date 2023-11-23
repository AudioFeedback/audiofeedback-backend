import { PrismaClient, Role, Track, TrackVersion, User } from '@prisma/client'
import { fakerNL } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {
  const superUser = await createRandomUser([Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN], "superuser");

  const admin = await createRandomUser([Role.ADMIN], "admin");
  const feedbackgever1 = await createRandomUser([Role.FEEDBACKGEVER], "feedbackgever");
  const feedbackgever2= await createRandomUser([Role.FEEDBACKGEVER]);
  const feedbackgever3 = await createRandomUser([Role.FEEDBACKGEVER]);


  const musicProducer1 = await createRandomUser([Role.MUZIEKPRODUCER], "muziekproducer");

  const PhonHouseBeatTrack = await addTrackToMusicProducer(musicProducer1, PhonHouseBeat, [feedbackgever1, feedbackgever3]);
  const WatrByYourSideTrack = await addTrackToMusicProducer(musicProducer1, WatrByYourSide, [feedbackgever1, feedbackgever2, feedbackgever3]);
  const FuturisticBeatTrack = await addTrackToMusicProducer(musicProducer1, FuturisticBeat, [feedbackgever1, feedbackgever2, feedbackgever3]);

  const musicroducer2 = await createRandomUser([Role.MUZIEKPRODUCER]);

  const EmbraceTrack = await addTrackToMusicProducer(musicroducer2, Embrace, [feedbackgever1, feedbackgever2, feedbackgever3]);
  const ModernVlogTrack = await addTrackToMusicProducer(musicroducer2, ModernVlog, [feedbackgever3]);


  await addFeedbackToTrack(createRandomFeedback(), PhonHouseBeatTrack[0], feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), PhonHouseBeatTrack[1], feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack[0], feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack[1], feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack[0], feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack[1], feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack[0], feedbackgever1)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack[1], feedbackgever1)

  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack[0], feedbackgever2)
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack[1], feedbackgever2)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack[0], feedbackgever2)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack[1], feedbackgever2)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack[0], feedbackgever2)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack[1], feedbackgever2)


  await addFeedbackToTrack(createRandomFeedback(), PhonHouseBeatTrack[0], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), PhonHouseBeatTrack[1], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack[0], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), WatrByYourSideTrack[1], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack[0], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), FuturisticBeatTrack[1], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack[0], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), EmbraceTrack[1], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), ModernVlogTrack[0], feedbackgever3)
  await addFeedbackToTrack(createRandomFeedback(), ModernVlogTrack[1], feedbackgever3)
}


function createRandomUser(roles: Role[], username?: string): Promise<User> {
  const data = {
    username: username ? username : fakerNL.internet.userName(),
    firstname: fakerNL.person.firstName(),
    password: "demo123",
    lastname: fakerNL.person.lastName(),
    roles: roles,
  }

  return prisma.user.create({data});
}

function createRandomFeedback(): FeedbackData {
  return {
    rating: fakerNL.datatype.boolean(),
    comment: fakerNL.lorem.lines({min: 1, max: 1}),
    timestamp: fakerNL.number.float({min: 0.1, precision: 0.01 }),
    isPublished: true,
  }
}

async function addTrackToMusicProducer(user: User, trackData: TrackData, reviewers: User[]) {

  const {title, genre, versionNumber, description, guid, filetype, duration} = trackData;

  const track = await prisma.track.create({
    data: {
      title: title,
      genre: genre,
      reviewers: {
        connect: reviewers.map(x => { return {username: x.username}}),
      },
      author: {
        connect: {username: user.username}
      }
    }
  })

  const firstTrackVersion = await prisma.trackVersion.create({
    data: {
      versionNumber: versionNumber,
      description: description,
      guid: guid,
      filetype: filetype,
      duration: duration,
      track: {
        connect: track
      }
    }
  })

  const secondTrackVersion = await prisma.trackVersion.create({
    data: {
      versionNumber: 2,
      description: "Tweede versie is de beste versie",
      guid: guid,
      filetype: filetype,
      duration: duration,
      track: {
        connect: track
      }
    }
  })
  
  return [firstTrackVersion, secondTrackVersion];
}

function addFeedbackToTrack(feedback: FeedbackData, track: TrackVersion, user: User) {
  return prisma.feedback.create({
    data: {
      ...feedback,
      trackVersion: {
        connect: track
      },
      user: {
        connect: {username: user.username}
      }
    }
  })
}

interface TrackData {
  title: string;
  genre: string;
  versionNumber: number;
  description: string;
  guid: string;
  filetype: string;
  duration: number;
}

interface FeedbackData {
  rating: boolean;
  comment: string;
  timestamp: number;
  isPublished: boolean;
}

// Zie folder discord, importeer deze in de folder /audio

const PhonHouseBeat: TrackData = {
  title: "Phonk House Beat (You Wanna Play)",
  genre: "Fonk",
  guid: "phonk-house-beat-you-wanna-play-126321",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 100,
}

const WatrByYourSide: TrackData = {
  title: "WatR. - By Your Side",
  genre: "House",
  guid: "watr-by-your-side-11516",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 194,
}

const FuturisticBeat: TrackData = {
  title: "Futuristic Beat",
  genre: "Trap",
  guid: "futuristic-beat-146661",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 121,
}

const Embrace: TrackData = {
  title: "Embrace",
  genre: "Uplifting",
  guid: "embrace-12278",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 179,
}

const ModernVlog: TrackData = {
  title: "Modern Vlog",
  genre: "Future Bass",
  guid: "modern-vlog-140795",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 139,
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