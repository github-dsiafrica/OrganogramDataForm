export interface AddRowFormProps {
	lastId: number;
	parentIds: { id: string; title: string }[];
	setRows: React.Dispatch<React.SetStateAction<Row[] | undefined>>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Types
export enum Type {
	Group = "group",
	Project = "project",
	Member = "member",
	Info = "info",
}

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
	PostgraduateStudent = "Postgraduate Student",
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
	TrainingAndOutreachCoordinator = "Training And Outreach Coordinator",
	TrainingCoordinator = "Training Coordinator",
	WebDeveloper = "Web Developer",
}

export type Group = {
	id: string;
	title: string;
	parentId?: string;
	acronym: string;
	type: "group";
	link: string;
	institution?: string;
	country?: string;
	picture?: string;
	pi?: string;
	bio?: string;
	expertise?: string;
	role?: string;
};

export type Project = {
	id: string;
	parentId: string;
	title: string;
	acronym?: string;
	institution: string;
	country: string;
	picture: string;
	pi: string;
	type: "project";
	link?: string;
	bio?: string;
	expertise?: string;
	role?: string;
};

export type Member = {
	id: string;
	parentId: string;
	title: string;
	picture?: string;
	type: "member";
	role: Role;
	institution?: string;
	country?: string;
	acronym?: string;
	pi?: string;
	link?: string;
	bio?: string;
	expertise?: string;
};

export type Info = {
	id: string;
	parentId: string;
	type: "info";
	link: string;
	bio: string;
	expertise?: string;
	title?: string;
	acronym?: string;
	institution?: string;
	country?: string;
	picture?: string;
	pi?: string;
	role?: string;
};

export type Row = Group | Project | Member | Info;

export interface EditRowFormProps {
	row: Row;
	parentIds: { id: string; title: string }[];
	setRows: React.Dispatch<React.SetStateAction<Row[] | undefined>>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ExternalCSVRow = {
	full_name: string;
	country_residence: string;
	orcid: string;
	email: string;
	highest_qualification: string;
	expertise: string;
	institution: string;
	project_role: string;
	start_date: string;
	initial_position: string;
	current_position: string;
	wgs: string;
};

export interface ImportCSVFormProps {
	rows: Row[] | undefined;
	setRows: React.Dispatch<React.SetStateAction<Row[] | undefined>>;
	getLastId: () => number;
	isImportDialogOpen: boolean;
	setIsImportDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface OrganogramFormProps {
	rows: Row[] | undefined;
	setRows: React.Dispatch<React.SetStateAction<Row[] | undefined>>;
	error: string | null;
	isAddDialogOpen: boolean;
	setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isImportDialogOpen: boolean;
	setIsImportDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isClearStorageDialogOpen: boolean;
	storageAvailable: boolean;
	setIsClearStorageDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setStorageAvailable: React.Dispatch<React.SetStateAction<boolean>>;
	setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
}
