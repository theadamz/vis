import ComboBox from "@/Components/ComboBox";
import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import Toast from "@/Components/Toast";
import { PageProps, UserDataTable } from "@/types";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { useForm } from "@inertiajs/react";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { FormEventHandler, ReactNode, useEffect, useState } from "react";

type FormProps = {
    roles: Array<{ value: string; label: string }>;
    sites: Array<{ value: string; label: string }>;
    edit?: boolean;
    editData?: UserDataTable;
    onSuccess?: () => void;
    onCancel?: () => void;
    onError?: (message: string) => void;
};

const Form = ({ roles, sites, edit = false, editData, onSuccess, onCancel, onError }: FormProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, put, processing, errors, clearErrors, reset } = useForm<UserDataTable>({
        id: null,
        username: "",
        email: "",
        password: "",
        name: "",
        role: "",
        role_name: "",
        site: "",
        site_name: "",
        is_active: true,
    });

    /*** componenet state ***/
    const [isEdit, setIsEdit] = useState<boolean>(edit);

    /*** effect ***/
    useEffect(() => {
        if (edit && editData) {
            setIsEdit(edit);
            setData(editData);
        }
    }, [edit, editData]);

    /*** events ***/
    const resetForm = () => {
        reset();
        clearErrors();
        setIsEdit(false);
    };

    const handleFormSuccess = () => {
        resetForm();
        onSuccess && onSuccess();
    };

    const handleFormClose = () => {
        resetForm();
        onCancel && onCancel();
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        if (isEdit) {
            put(route("app.user.update", { id: data.id }), {
                onSuccess: (response) => {
                    const props = response.props as PageProps;
                    const flash = props.flash;
                    if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
                    handleFormSuccess();
                },
                onError: (errors) => {
                    if (errors.message) {
                        onError && onError(errors.message);
                    } else {
                        Toast({ variant: "warning", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        } else {
            post(route("app.user.store"), {
                onSuccess: (response) => {
                    const props = response.props as PageProps;
                    const flash = props.flash;
                    if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
                    handleFormSuccess();
                },
                onError: (errors) => {
                    if (errors.message) {
                        onError && onError(errors.message);
                    } else {
                        Toast({ variant: "warning", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        }
    };

    return (
        <form onSubmit={submitForm}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Username
                    </Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="col-span-3"
                        maxLength={100}
                        required
                        onChange={(e) => setData("username", e.target.value)}
                        value={data.username}
                        error={errors.username}
                        showErrorMessage={false}
                    />
                    {errors.username && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.username}</span>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="col-span-3"
                        maxLength={100}
                        required={!isEdit}
                        onChange={(e) => setData("password", e.target.value)}
                        value={data.password}
                        error={errors.password}
                        showErrorMessage={false}
                    />
                    {errors.password && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.password}</span>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="col-span-3"
                        maxLength={100}
                        required
                        onChange={(e) => setData("email", e.target.value)}
                        value={data.email}
                        error={errors.email}
                        showErrorMessage={false}
                    />
                    {errors.email && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.email}</span>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        className="col-span-3"
                        maxLength={100}
                        required
                        onChange={(e) => setData("name", e.target.value)}
                        value={data.name}
                        error={errors.name}
                        showErrorMessage={false}
                    />
                    {errors.name && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.name}</span>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                        Role
                    </Label>
                    <Select className="col-span-3" value={data.role} onValueChange={(value) => setData("role", value)} items={roles} error={errors.role} showErrorMessage={false} />
                    {errors.role && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.role}</span>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="site" className="text-right">
                        Site
                    </Label>
                    <ComboBox
                        className="w-full col-span-3"
                        placeholder="Site"
                        defValue={data.site}
                        items={sites}
                        onValueChange={(value) => setData("site", value)}
                        error={errors.site}
                        showErrorMessage={false}
                    />
                    {errors.site && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.site}</span>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="is_active" className="text-right">
                        Active
                    </Label>
                    <Checkbox
                        id="is_active"
                        name="is_active"
                        defaultChecked={data.is_active}
                        checked={data.is_active}
                        onCheckedChange={(e) => setData("is_active", e.valueOf() as boolean)}
                    />
                </div>
            </div>
            <div className="w-full flex justify-between mt-5">
                <Button type="button" onClick={handleFormClose}>
                    <Cross2Icon className="mr-2 h-4 w-4" />
                    Close
                </Button>
                <Button type="submit" disabled={processing} variant={"outline"}>
                    {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                    Save
                </Button>
            </div>
        </form>
    );
};

export default Form;
