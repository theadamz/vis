import { ErrorBag, Errors } from "@inertiajs/core";
import { CheckType, InspectionType, Stage } from "./enum";

/*** App ***/
export type Role = {
    id: string | null;
    name: string;
    def_path: string;
};

export type Site = {
    id: string | null;
    code: string;
    name: string;
    address: string;
    is_active: boolean;
};

export type Access = {
    id: string | null;
    code: string;
    name: string;
    permissions: { [key: string]: boolean };
};

export type UserDataTable = {
    id?: string | null;
    username: string;
    email: string;
    password?: string;
    name: string;
    role?: string;
    role_name: string;
    site?: string;
    site_name: string;
    is_active: boolean;
};

export type TransactionType = {
    id: string | null;
    code: string;
    name: string;
    prefix: string;
    suffix: string;
    length_seq: number;
    format_seq: string;
};

/*** Basic ***/
export type VehicleType = {
    id: string | null;
    name: string;
    is_visible: boolean;
};

/*** Inspection ***/
export type InspectionForm = {
    id?: string;
    vehicle_type_id?: string;
    type: InspectionType;
    code: string;
    name: string;
    use_eta_dest: boolean;
    use_ata_dest: boolean;
    is_publish: boolean;
};

export type InspectionFormCategory = {
    id?: string;
    inspection_form_id?: string;
    stage: Stage;
    description: string;
    order: number;
    is_separate_page: boolean;
};

export type InspectionFormCheck = {
    id?: string;
    inspection_form_category_id: string;
    description: string;
    type: CheckType;
    order: number;
};

export type Inspection = {
    id?: string;
    inspection_form_id: string;
    doc_no: string;
    doc_date: Date;
    container_no: string;
    seal_no: string;
    inspected_by: string;
    driver_name: string;
    driver_id_no: string;
    driver_pic: string;
    driver_phone_no: string;
    vehicle_reg_no: string;
    vehicle_paper_no: string;
    vehicle_paper_pic: string;
    checked_in_by: string;
    checked_in_at: Date;
    loading_start_by: string;
    loading_start_at: Date;
    loading_end_by: string;
    loading_end_at: Date;
    checked_out_by: string;
    checked_out_at: Date;
    arrival_time_at_fty: Date;
    depart_time_from_fty: Date;
    eta_to_dest: Date;
    actual_time_arrival_to_dest: Date;
    export_notified_by: string;
    remarks: string;
    stage: Stage;
};

/*** Core ***/
export type User = {
    username: string;
    name: string;
    email: string;
    def_path: string;
};

export type AppInfo = {
    web_name: string;
    web_name_short: string;
    web_description: string;
};

export type Config = {
    url: string;
    locale: string;
    date_format: string;
    time_format: string;
    datetime_format: string;
};

export type Group = {
    code: string;
    name: string;
};

export type Menu = {
    group_code: string;
    parent_menu_code: string;
    code: string;
    name: string;
    path: string;
    icon: string;
    children: null | Menu[];
};

export type Permission = {
    read: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    validation?: boolean;
};

export type AccessMenu = {
    menu: Menu;
    permissions: Permission;
};

export type Flash = {
    alert?: {
        icon: string;
        variant: string;
        title: string;
        message: string;
    };
    toast?: {
        variant: string;
        title: string;
        message: string;
    };
    message?: string;
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    access: AccessMenu;
    app: AppInfo;
    auth: {
        user: User;
    };
    config: Config;
    flash: Flash;
    prev_url?: string;
} & {
    errors: Errors & ErrorBag;
};

/*** Others ***/
export type Option = {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    withCount?: boolean;
};
