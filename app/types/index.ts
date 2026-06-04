export interface AimObjective {
    id: number;
    text: string;
  }
  
  export interface BoardMember {
    sNo: number;
    name: string;
    fatherName: string;
    age: number;
    designation: string;
    address: string;
  }
  
  export interface LegalCertificate {
    id: number;
    text: string;
  }
  
  export interface MembershipFeeDetails {
    admissionFee: number;
    annualSubscription: number;
    currency: string;
    forfeiturePeriodMonths: number;
  }