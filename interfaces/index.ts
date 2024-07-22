type Group = {
	id: number;
	title: string;
	parentId?: number;
	acronym: string;
	type: "group";
	link: string;
};

type Project = {
	id: number;
	parentId: number;
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
	id: number;
	parentId: number;
	title: string;
	picture?: string;
	type: "member";
	role:
		| "Contact PI"
		| "MPI"
		| "PI"
		| "Co-PI"
		| "Program Manager"
		| "Project Manager/Coordinator"
		| "Project Coordinator"
		| "Administrator"
		| "Administrative Assistant"
		| "Collaborator"
		| "Collaboration"
		| "Consultant"
		| "Co-Investigator"
		| "DMAC Lead/Member"
		| "Data Analyst"
		| "Data curator"
		| "Data Manager"
		| "Data scientist"
		| "eLwazi Uganda Node Bioinformatician/Data Scientist"
		| "Hub Deputy Director"
		| "Master's student"
		| "Member and co-chair I-WG"
		| "Member/Collaborator"
		| "PhD Student"
		| "PhD Trainee"
		| "Post-Doc"
		| "Pre-Doc"
		| "Project Team Member"
		| "REDCap Administrator"
		| "REDCap Database Developer"
		| "Research Assistant"
		| "Research Fellow"
		| "Researcher"
		| "Sequencing"
		| "Site Investigator"
		| "Site PI"
		| "Software Developer"
		| "Software Engineer"
		| "System Admin | Data Scientist"
		| "Systems Administrator"
		| "Training and Outreach Coordinator"
		| "Training Coordinator"
		| "Web Developer"
		| "";
};

type Info = {
	id: number;
	parentId: number;
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
