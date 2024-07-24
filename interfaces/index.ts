type Group = {
	id: string;
	title: string;
	parentId?: string;
	acronym: string;
	type: "group";
	link: string;
};

type Project = {
	id: string;
	parentId: string;
	title: string;
	acronym?: string;
	institution: string;
	country: string;
	picture: string;
	pi: string;
	type: "project";
	link: string;
};

type Member = {
	id: string;
	parentId: string;
	title: string;
	picture?: string;
	type: "member";
	role: Role;
};

export enum Role {
	ContactPI = "Contact PI",
	MPI = "MPI",
	PI = "PI",
	CoPI = "Co-PI",
	ProgramManager = "Program Manager",
	ProjectManagerCoordinator = "Project Manager/Coordinator",
	ProjectCoordinator = "Project Coordinator",
	Administrator = "Administrator",
	AdministrativeAssistant = "Administrative Assistant",
	Collaborator = "Collaborator",
	Collaboration = "Collaboration",
	Consultant = "Consultant",
	CoInvestigator = "Co-Investigator",
	DMACLeadMember = "DMAC Lead/Member",
	DataAnalyst = "Data Analyst",
	DataCurator = "Data curator",
	DataManager = "Data Manager",
	DataScientist = "Data scientist",
	eLwaziUgandaNodeBioinformaticianDataScientist = "eLwazi Uganda Node Bioinformatician/Data Scientist",
	HubDeputyDirector = "Hub Deputy Director",
	MastersStudent = "Master's student",
	MemberAndCoChairIWG = "Member and co-chair I-WG",
	MemberCollaborator = "Member/Collaborator",
	PhDStudent = "PhD Student",
	PhDTrainee = "PhD Trainee",
	PostDoc = "Post-Doc",
	PreDoc = "Pre-Doc",
	ProjectTeamMember = "Project Team Member",
	REDCapAdministrator = "REDCap Administrator",
	REDCapDatabaseDeveloper = "REDCap Database Developer",
	ResearchAssistant = "Research Assistant",
	ResearchFellow = "Research Fellow",
	Researcher = "Researcher",
	Sequencing = "Sequencing",
	SiteInvestigator = "Site Investigator",
	SitePI = "Site PI",
	SoftwareDeveloper = "Software Developer",
	SoftwareEngineer = "Software Engineer",
	SystemAdminDataScientist = "System Admin | Data Scientist",
	SystemsAdministrator = "Systems Administrator",
	TrainingAndOutreachCoordinator = "Training and Outreach Coordinator",
	TrainingCoordinator = "Training Coordinator",
	WebDeveloper = "Web Developer",
}

type Info = {
	id: string;
	parentId: string;
	type: "info";
	link: string;
	bio: string;
	expertise: string;
};

export type Row = Group | Project | Member | Info;

export enum Type {
	Group = "group",
	Project = "project",
	Member = "member",
	Info = "info",
}

export interface TableRowProps {
	row: Row;
}

export interface AddRowFormProps {
	lastId: number;
	parentIds: string[];
}
