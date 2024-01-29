import { fakerNL } from "@faker-js/faker";
import {
  InviteStatus,
  Label,
  PrismaClient,
  Role,
  TrackVersion,
  User,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create label

  const LabelSwingTijger = await createLabel(SwingTijger);
  const LabelBananenBeat = await createLabel(BananenBeat);
  const LabelLachendeNoten = await createLabel(LachendeNoten);
  const LabelFunkFusie = await createLabel(FunkFusie);

  const superUser = await createRandomUser(
    [Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN],
    "superuser",
  );

  const admin = await createRandomUser([Role.ADMIN], "admin");
  const feedbackgever1 = await createRandomUser(
    [Role.FEEDBACKGEVER],
    "feedbackgever",
  );
  const feedbackgever2 = await createRandomUser([Role.FEEDBACKGEVER]);
  const feedbackgever3 = await createRandomUser([Role.FEEDBACKGEVER]);

  const musicProducer1 = await createRandomUser(
    [Role.MUZIEKPRODUCER],
    "muziekproducer",
  );

  const PerfectNight = await addTrackToMusicProducer(
    musicProducer1,
    PefectNight,
    [feedbackgever1, feedbackgever3],
  );

  await addTrackToLabel(PerfectNight[0], LabelSwingTijger);
  await addTrackToLabel(PerfectNight[0], LabelBananenBeat);
  await addTrackToLabel(PerfectNight[0], LabelLachendeNoten);
  await addTrackToLabel(PerfectNight[0], LabelFunkFusie);

  const WatrByYourSideTrack = await addTrackToMusicProducer(
    musicProducer1,
    WatrByYourSide,
    [feedbackgever1, feedbackgever2, feedbackgever3],
  );

  await addTrackToLabel(WatrByYourSideTrack[0], LabelSwingTijger);
  await addTrackToLabel(WatrByYourSideTrack[0], LabelBananenBeat);
  await addTrackToLabel(WatrByYourSideTrack[0], LabelLachendeNoten);
  await addTrackToLabel(WatrByYourSideTrack[0], LabelFunkFusie);

  const FuturisticBeatTrack = await addTrackToMusicProducer(
    musicProducer1,
    FuturisticBeat,
    [feedbackgever1, feedbackgever2, feedbackgever3],
  );

  await addTrackToLabel(FuturisticBeatTrack[0], LabelSwingTijger);
  await addTrackToLabel(FuturisticBeatTrack[0], LabelBananenBeat);
  await addTrackToLabel(FuturisticBeatTrack[0], LabelLachendeNoten);
  await addTrackToLabel(FuturisticBeatTrack[0], LabelFunkFusie);

  const musicroducer2 = await createRandomUser([Role.MUZIEKPRODUCER]);

  const EmbraceTrack = await addTrackToMusicProducer(musicroducer2, Embrace, [
    feedbackgever1,
    feedbackgever2,
    feedbackgever3,
  ]);

  await addTrackToLabel(EmbraceTrack[0], LabelSwingTijger);
  await addTrackToLabel(EmbraceTrack[0], LabelBananenBeat);
  await addTrackToLabel(EmbraceTrack[0], LabelLachendeNoten);
  await addTrackToLabel(EmbraceTrack[0], LabelFunkFusie);

  const ModernVlogTrack = await addTrackToMusicProducer(
    musicroducer2,
    ModernVlog,
    [feedbackgever3],
  );

  await addUserToLabel(InviteStatus.ACCEPTED, superUser, LabelSwingTijger);
  await addUserToLabel(InviteStatus.ACCEPTED, superUser, LabelBananenBeat);
  await addUserToLabel(InviteStatus.ACCEPTED, superUser, LabelLachendeNoten);
  await addUserToLabel(InviteStatus.ACCEPTED, superUser, LabelFunkFusie);

  await addUserToLabel(InviteStatus.ACCEPTED, admin, LabelSwingTijger);
  await addUserToLabel(InviteStatus.ACCEPTED, admin, LabelBananenBeat);
  await addUserToLabel(InviteStatus.ACCEPTED, admin, LabelLachendeNoten);
  await addUserToLabel(InviteStatus.ACCEPTED, admin, LabelFunkFusie);

  await addUserToLabel(InviteStatus.ACCEPTED, feedbackgever1, LabelSwingTijger);
  await addUserToLabel(InviteStatus.ACCEPTED, feedbackgever1, LabelBananenBeat);
  await addUserToLabel(
    InviteStatus.ACCEPTED,
    feedbackgever1,
    LabelLachendeNoten,
  );
  await addUserToLabel(InviteStatus.INVITED, feedbackgever1, LabelFunkFusie);

  await addUserToLabel(InviteStatus.INVITED, feedbackgever2, LabelSwingTijger);
  await addUserToLabel(InviteStatus.ACCEPTED, feedbackgever2, LabelBananenBeat);
  await addUserToLabel(
    InviteStatus.INVITED,
    feedbackgever2,
    LabelLachendeNoten,
  );
  await addUserToLabel(InviteStatus.ACCEPTED, feedbackgever2, LabelFunkFusie);

  // await addUserToLabel(InviteStatus.ACCEPTED, feedbackgever3, LabelSwingTijger)
  // await addUserToLabel(InviteStatus.INVITED, feedbackgever3, LabelBananenBeat)
  // await addUserToLabel(InviteStatus.ACCEPTED, feedbackgever3, LabelLachendeNoten)
  // await addUserToLabel(InviteStatus.INVITED, feedbackgever3, LabelFunkFusie)

  await addFeedbackToTrack(
    createRandomFeedback(),
    PerfectNight[0],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    PerfectNight[1],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    PerfectNight[1],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    PerfectNight[1],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    WatrByYourSideTrack[0],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    WatrByYourSideTrack[1],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    FuturisticBeatTrack[0],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    FuturisticBeatTrack[1],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    EmbraceTrack[0],
    feedbackgever1,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    EmbraceTrack[1],
    feedbackgever1,
  );

  await addFeedbackToTrack(
    createRandomFeedback(),
    FuturisticBeatTrack[0],
    feedbackgever2,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    FuturisticBeatTrack[1],
    feedbackgever2,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    EmbraceTrack[0],
    feedbackgever2,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    EmbraceTrack[1],
    feedbackgever2,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    WatrByYourSideTrack[0],
    feedbackgever2,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    WatrByYourSideTrack[1],
    feedbackgever2,
  );

  await addFeedbackToTrack(
    createRandomFeedback(),
    PerfectNight[0],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    PerfectNight[1],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    WatrByYourSideTrack[0],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    WatrByYourSideTrack[1],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    FuturisticBeatTrack[0],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    FuturisticBeatTrack[1],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    EmbraceTrack[0],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    EmbraceTrack[1],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    ModernVlogTrack[0],
    feedbackgever3,
  );
  await addFeedbackToTrack(
    createRandomFeedback(),
    ModernVlogTrack[1],
    feedbackgever3,
  );
}

async function createRandomUser(
  roles: Role[],
  username?: string,
): Promise<User> {
  const data = {
    username: username ? username : fakerNL.internet.userName(),
    firstname: fakerNL.person.firstName(),
    // password: await bcrypt.hash("demo123", 10),
    lastname: fakerNL.person.lastName(),
    roles: roles,
    sub: crypto.randomUUID(),
  };

  return prisma.user.create({ data });
}

function createRandomFeedback(): FeedbackData {
  return {
    rating: fakerNL.datatype.boolean(),
    comment: fakerNL.lorem.lines({ min: 1, max: 1 }),
    timestamp: fakerNL.number.float({ min: 0.1, precision: 0.01 }),
    isPublished: true,
  };
}

async function addTrackToMusicProducer(
  user: User,
  trackData: TrackData,
  reviewers: User[],
) {
  const { title, genre, versionNumber, description, guid, filetype, duration } =
    trackData;

  const track = await prisma.track.create({
    data: {
      title: title,
      genre: genre,
      reviewers: {
        connect: reviewers.map((x) => {
          return { username: x.username };
        }),
      },
      author: {
        connect: { username: user.username },
      },
    },
  });

  const firstTrackVersion = await prisma.trackVersion.create({
    data: {
      versionNumber: versionNumber,
      description: description,
      guid: guid,
      filetype: filetype,
      duration: duration,
      track: {
        connect: track,
      },
    },
  });

  const secondTrackVersion = await prisma.trackVersion.create({
    data: {
      versionNumber: 2,
      description: "Tweede versie is de beste versie",
      guid: guid,
      filetype: filetype,
      duration: duration,
      track: {
        connect: track,
      },
    },
  });

  return [firstTrackVersion, secondTrackVersion];
}

function addFeedbackToTrack(
  feedback: FeedbackData,
  track: TrackVersion,
  user: User,
) {
  return prisma.feedback.create({
    data: {
      ...feedback,
      trackVersion: {
        connect: track,
      },
      user: {
        connect: { username: user.username },
      },
    },
  });
}

function addUserToLabel(status: InviteStatus, user: User, label: Label) {
  return prisma.labelMember.create({
    data: {
      status: status,
      label: {
        connect: {
          id: label.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
}

function createLabel(label: LabelData) {
  return prisma.label.create({
    data: {
      ...label,
    },
  });
}

async function addTrackToLabel(trackVersion: TrackVersion, label: Label) {
  const track = await prisma.track.findFirst({
    where: {
      trackVersions: {
        some: {
          id: trackVersion.id,
        },
      },
    },
  });

  return prisma.track.update({
    where: {
      id: track.id,
    },
    data: {
      label: {
        connect: { id: label.id },
      },
    },
  });
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

interface LabelData {
  name: string;
  websiteUrl: string;
  description: string;
  genre: string;
}

// Zie folder discord, importeer deze in de folder /audio

const PefectNight: TrackData = {
  title: "Perfect Night (Holiday Remix)",
  genre: "2-step garage",
  guid: "perfect-night-holiday-remix-143872",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 162,
};

const WatrByYourSide: TrackData = {
  title: "WatR. - By Your Side",
  genre: "House",
  guid: "watr-by-your-side-11516",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 194,
};

const FuturisticBeat: TrackData = {
  title: "Futuristic Beat",
  genre: "Trap",
  guid: "futuristic-beat-146661",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 121,
};

const Embrace: TrackData = {
  title: "Embrace",
  genre: "Uplifting",
  guid: "embrace-12278",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 179,
};

const ModernVlog: TrackData = {
  title: "Modern Vlog",
  genre: "Future Bass",
  guid: "modern-vlog-140795",
  filetype: "mp3",
  versionNumber: 1,
  description: "Eerste versie van de track.",
  duration: 139,
};

const SwingTijger: LabelData = {
  name: "Swing Tijger",
  websiteUrl: "https://swingtijger.nl",
  description: "Jazz voor katachtige dansmoves.",
  genre: "Jazzhop",
};

const BananenBeat: LabelData = {
  name: "Bananen Beat",
  websiteUrl: "https://bananenbeat.nl",
  description: "Rijpe beats voor een tropische sfeer.",
  genre: "Tropische House",
};

const LachendeNoten: LabelData = {
  name: "Lachende Noten",
  websiteUrl: "https://lachendenoten.nl",
  description: "Muziek die een glimlach op je gezicht tovert.",
  genre: "Feelgood Pop",
};

const FunkFusie: LabelData = {
  name: "Funk Fusie",
  websiteUrl: "https://funkfusie.nl",
  description: "Smeltkroes van funky geluiden.",
  genre: "Eclectische Funk",
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
