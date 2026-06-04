import { AimObjective, BoardMember, LegalCertificate, MembershipFeeDetails } from "@/app/types";

export const ASSOCIATION_INFO = {
  name: "Embryologists Association of Andhra Pradesh",
  abbreviation: "EAAP",
  tagline: "Empowering Embryologists - Advancing Science",
  registeredAddress: "Door No.3-161/53-509, Nidamanuru, Vijayawada Rural, N.T.R. District.",
  actReference: "Andhra Pradesh Societies Registration Act 35 of 2001",
};

export const AIMS_AND_OBJECTIVES: AimObjective[] = [
  { id: 1, text: "To promote the science and practice of Clinical Embryology" },
  { id: 2, text: "To establish and maintain high standards in ART laboratories" },
  { id: 3, text: "To conduct CMEs, workshops, conferences, and training programs" },
  { id: 4, text: "To encourage research and innovation in reproductive medicine" },
  { id: 5, text: "To support professional development and welfare of embryologists" },
  { id: 6, text: "To create awareness about ART among the public" },
  { id: 7, text: "To collaborate with national and international bodies" },
  { id: 8, text: "To represent embryologists in legal, regulatory, and professional matters" },
];

export const GOVERNING_BODY: BoardMember[] = [
  {
    sNo: 1,
    name: "Yejarla Kishore Babu",
    fatherName: "Veeraiah",
    age: 45,
    designation: "President",
    address: "Door No.Fno-59, Pavan clasic Aparts, Nidamaluru, Vijayawadarural, N.T.R. Distrcit.",
  },
  {
    sNo: 2,
    name: "Tatikonda Suresh Kumar",
    fatherName: "Appalaraju",
    age: 45,
    designation: "Vice-President",
    address: "Door No.16-747,Plotno-88, GVMC Layout, Visakhapatnam,",
  },
  {
    sNo: 3,
    name: "Valluri Lenin Babu",
    fatherName: "Venkata Rao",
    age: 38,
    designation: "Secretary",
    address: "Door No.6-40, Srinagar Colony, Ongole, Prakasam District.",
  },
  {
    sNo: 4,
    name: "Palavalasa Dileep Kumar",
    fatherName: "Surya Rao",
    age: 35,
    designation: "Joint-Secretary",
    address: "Door No.8-4, Lasya Township Tallavalasa,chittivalasa, Visakhapatnam District.",
  },
  {
    sNo: 5,
    name: "Venkata B Subrahmanyam",
    fatherName: "Venkateswarlu",
    age: 37,
    designation: "Treasurer",
    address: "Door No.2-17,Enikepadu, Vijayawadarural, NTR.District.",
  },
  {
    sNo: 6,
    name: "Pancheti Midhun Chakravarthi",
    fatherName: "Not Specified",
    age: 38,
    designation: "Joint Treasurer",
    address: "Door No.0-0,Poolathota, H W Anepudi, Nellore District.",
  },
  {
    sNo: 7,
    name: "Kolli Eswara Rao",
    fatherName: "Pidiayya",
    age: 38,
    designation: "Executive Member",
    address: "Door No.0-0, Regapalem, Srikakulam District.",
  },
  {
    sNo: 8,
    name: "Modurthi Siva Krishna",
    fatherName: "Sekhar",
    age: 36,
    designation: "Executive Member",
    address: "Door No. 12, Pedagudem, Ghantasala, Krishna District.",
  },
  {
    sNo: 9,
    name: "Kanumetta Srikanth",
    fatherName: "Not Specified",
    age: 38,
    designation: "Executive Member",
    address: "F/502,5th Floor, Natures Pride, Yendada, Visakhapatnam District.",
  },
];

export const LEGAL_CERTIFICATES: LegalCertificate[] = [
  { id: 1, text: "Certified that the society is formed with no profit motive and no commercial activity is involved in its working." },
  { id: 2, text: "Certified that society would not engage in agitatinal activities to ventilate grievances." },
  { id: 3, text: "Certified that the office bearers are not paid from the funds of the society." },
  { id: 4, text: "Certified that the office bearers signatures are genuine." },
];

export const MEMBERSHIP_FEES: MembershipFeeDetails = {
  admissionFee: 1500,
  annualSubscription: 1500,
  currency: "INR",
  forfeiturePeriodMonths: 3,
};

export const MEMBERSHIP_RULES = [
  "Every member shall pay an amount of Rs.1500/- as membership fee at the time of admission.",
  "Each membr shall pay Rs.1500/- as annual subscription at beginning of every year.",
  "If it is not paid within three months from the date of commencement of the financial year, such member shall forfeit the membership.",
  "However Governing Body/Managing committee shall have power to fix membership fee at any time.",
  "After getting member ship, the member shall abide by the Rules and Regulations of the Association.",
  "Any member of the Society may resign his membership by notifying the Secretary in writing.",
  "The executive committee may at it's discretion take such action including explusion of a member in case the conduct or the activities of such member are found to be detrimental to the interests of the society.",
  "The Persons whose membership is forfeited, can rejoin as members subject to the approval of the managing committee on payment of such fee as determined and within the time laid down by them.",
];

export const PATRONS_RULE = "Gentlemen of status and rank may be invited by the managing committee to become patrons and Vice Patrons and by paying donation as approved by the managing Committee.";

export const FORFEITURE_POLICIES = [
  "Those who resign in writing and whose resignations are accepted by the managing Committee.",
  "Those who fail to attend three consecutive meetings of the managing committee.",
  "Those who were expelled by the Managing committee.",
];

export const MEETINGS_AND_STRUCTURE = {
  generalBodyMeeting: "The General Body meeting shall be conducted compulsarly every year in the month of JUNE, but in special circumstances it may conducted at any time if necessary.",
  generalBodyQuorum: "1/3rd of the members present at the meeting.",
  rulesModification: "The General Body can modify the rules of the Society subject to the provisions of the Andhra Pradesh Societies Registration Act 35/2011.",
  managingCommitteeComposition: "The Managing Committee shall consists of 9 members i.e. President, Vice-President, Secretary, one Joint Secretary, Treasurer, Joint Treasurer, and Three Executive Committee Members.",
  managingCommitteeElections: "All these will be elected by the General Body every two years.",
  managingCommitteeMeetings: "The Managing Committee should meet atleast once in three months or on the day notified by the Secretary and compulsarly in the month of March to review the transactions of the Society.",
  vacancyCoOption: "If a vacancy arises in this body it can be filled in by co-option by the Managing committee.",
  expulsionPower: "This body has the right to expel any member who violates the rules regulations,or ideals of the society and its ideals, without assigning any reason therefore.",
  executiveQuorum: "2/3rd of the members present.",
};

export const GENERAL_BODY_FUNCTIONS = [
  "To elect the members of Managing Committee.",
  "To pass the budget for the ensuring year and approve the income and Expenditure statement of the previous year.",
  "To receive and approve the annual report of society.",
  "To appoint an Auditor.",
  "To transact any other matter for the benefit of the society.",
];

export const GOVERNING_BODY_FUNCTIONS = [
  "An annual budget will be presented by the Managing Committee to the General Body at the Annual General Body meeting.",
  "The managing committee shall have power to frame byLaws not inconsistent with the rules for the regulation of affairs of all sections of the Association subject to the approval of the General Body at its next meeting.",
  "To publish, print, produce, copy, edit, distribute, sell or purchase books periodicals, magazines, journals, compendiums, digests, or any such matter which deserves to be disseminated for the benefit of public ingeneral and students in particular, in every media, including print, broadcast and electronic, or any other format found suitable.",
  "To oversee the affairs of the projects/project, programs implemented by the society.",
  "To accept donations, gifts, etc., from any source and seeks to any righful means to arise funds for the society.",
  "To start, take over, maintain, develop and administer and control any development projects, programs and institutions.",
  "To acquire or purchase assets and immovable properties for the society.",
  "To mortgage or sell properties of the society for the benefit of the society.",
  "To undertake any type of project or program for the welfare of the society employees.",
  "To consider amendments to Rules & Regulations.",
  "To encourage the poor merit students in getting their scholarships promptly in due time.",
];

export const ELECTION_RULES = [
  "The first Executive Committee shall comprise of the signatories to the Memorandum of the Society.",
  "The Nominations for the Election to the Executive Committee may be sent atleast Six weeks before the date of the General Body Meeting at which the election to be carried out.",
  "The President of the Society shall formulate the method and procedure of Election at every Metting at which the Election is exercise.",
  "The Chairman of the General Body shall be election officer.",
  "Every member whose name appears in the register of members of the Society shall have one vote at the general body meeting of the society at which election to the executive committee is exercised.",
  "The chairman of such general body shall have a casting vote in case of a tie.",
  "Officers shall be elected by simple majority at the general body meeting.",
];

export const DUTIES_OF_OFFICE_BEARERS = {
  president: [
    "The president shall preside over the executive committee and the General body and special meetings of the Association.",
    "He shall have the casting vote in case of a tie on any issue put to vote either by show of hands or by sescret ballot.",
    "He shall oversee the functioning of the Office Bearers and sub-committees, if any of the association in general.",
    "Thus he is total head of the society."
  ],
  vicePresident: [
    "Vice President shall function a President in the absence of the President and also perform such functions as the Presidentmay delegate to him from time to time."
  ],
  secretary: [
    "He is the Chief executive of the Society. He shall be the person vested with the authority to sue or to be sued in court of law in respect of any despute or disputes concerning the Association provided always that he is authorised to delegate this authority to any member or members nominated by him as he may deem fit in the best interests of the association.",
    "He shall maintain a Register of Members.",
    "He shall prepare and submit to the Executive Committee the Annual reports and get them ratified by the General Body at its annual General Body Meeting.",
    "He shall jointly operate the bank accounts along with the treasurer.",
    "He shall be the corresponding officer of the Association.",
    "He shall maintain or cause to maintain the following books for the Association; Cash Books Minutes Book Receipts and Vouchers.",
    "He Should attend for the all correspondence relating to the society and its sister organization.",
    "All appointments under the society should be made by the secretary and he may delegte such power to any office bearers for specific period.",
    "All the assests and liabilities should be inthe name of the institution represented by the name of secretary and correspondent.",
    "The Secretary is empowered to receive donations from the public and grants or renumeration from Government and account for the society's accounts and spend the amount in the way in which he thinks best."
  ],
  jointSecretary: [
    "The Joint Secretary shall assist in all his functions and perform such duties as the Secretary which may delegate to him from time to as per the occasion demands.",
    "He shall also perform such duties that the President or the Executive Committee may assign to him from time to time."
  ],
  treasurer: [
    "He shall be responsible to maintain the Records pertaining to Financial aspects.",
    "He shall be authorised to keep an impress cash to meet the exigencies of the Association.",
    "He shall deposit all moneys received in the bank or banks duly approved by the executive committee by way of a resolution recorded in the minutes book.",
    "Any sign the cheques in the absence of the Secretary and but the signature or the Treasurer is compulsory."
  ],
  jointTreasurer: [
    "The Joint Treasurer shall assist in all his functions and perform such duties as the Treasurer which may delegate to him from time to as per the occasion demands."
  ],
  executiveCommitteeMembers: [
    "The executive committee members as to due the duties entrested to them from time to time as per the occation demands."
  ]
};

export const FINANCIAL_AND_LEGAL_RULES = {
  fundsRaising: "To carry out the objects of the soceity, funds will be raised by donations, gift and other offerings as may be determined by the Executive Committee.",
  fundsSpending: "The Funds of the society shall be spent for the attainment of the object of the soceity and no portion there of shall paid or transferred directly or indirectly to any of its members through by any means.",
  bankOperation: "Funds of the society should be deposited in a shcedule Bank in the name of the society and bank account operate by President and Secretary or Treasurer jointly.",
  taxExemptions: "The society shall be authorised to make an application for exemption / deductions to income tax department under section 11,12A and section 80G of the income tax Act.",
  taxAlterations: "The society shall inform the commissioner of income tax if any alterations or modifications are made to clause of the Society.",
  investmentCompliance: "The society shall invest its in accordance with the provisions of section 13(i)(d) read with section 11(5) of the income tax Act, 1961.",
  auditRequirement: "The accounts of the society shall be audited by the qualified charted accountant and the financial years of the society shall be April 1st to March 31st.",
  amendmentsRule: "No amendment or aiteration shall be made inthe purpose of the society unless it is voted by 3/5th of the members present convend for the purpose and confirmed by 3/5th of the members present in General Body Meetings. Such amendments are to be carried out only with the prior permission of the concerned commissioner of Income tax after the society is registered U/S 12A of Income Tax Act, 1961.",
  disputesClause: "In the event of any disputes, arising among the committee or the members of the society in respect of any matter relating to the affairs of the Society, any member of the society may proceed with the dispute under the provisions as mentioned in the A.P.S.R.Act(Section23).",
  liquidationClause: "All the legal affairs of the society movable and immovable properties shall be settled under section 26 of the Societies Registration Act in the District court. It shall under Act 35 of the societies Registration act 2001 after obtaining the approval of 3/5th of the majority of the general body.",
};

export const DISSOLUTION_AND_WINDING_UP = {
  windingUpResolution: "If the General Body feels that it is necessary to wind up the Association after throughly examining all aspects, it can adopt a resolution to dissolve the Association.",
  assetsTransfer: "The assets etc., of the Association shall be trans ferred to another association having similar aims and objects.",
  sharingRestriction: "The assets of the Association shall, under no circumstances, be shared or appropriated to or by among the members 3/5th majority.",
  leftoverAssetsDissolution: "In the event of winding up of the society, if any property or balance of asset remains after set off of al its liabilities, such left over asst/assets shall be transferred to any other society having similar aims and objects and which is also registered U/S 12A and U/S 80G of Income Tax Act 1961.",
  assetsTransferTrust: "The society shall transfer its assets to similar trust or to similar organization having similar objects, at the time of dissolution of this soceity.",
  remainingAssetsTrust: "In the event of dissolution, the assets remaining the name of the trust, after full satisfaction of all labilities, will be transferred to some other trust/institution/society having similar aims and objects and having registered under section 12A and to which the provisions of section 80G(5) of the income tax Act, 1961 do apply.",
};