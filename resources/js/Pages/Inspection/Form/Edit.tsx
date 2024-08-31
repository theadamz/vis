import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import Select from "@/Components/Select";
import { Badge } from "@/Components/shadcn/ui/badge";
import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/shadcn/ui/dropdown-menu";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { Separator } from "@/Components/shadcn/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/shadcn/ui/table";
import Toast from "@/Components/Toast";
import { InspectionForm, InspectionFormCategory, InspectionFormCheck, PageProps, VehicleType } from "@/types";
import { getStage, InspectionType } from "@/types/enum";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { CheckIcon, Cross1Icon, HamburgerMenuIcon, Pencil1Icon, PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import { ChevronLeftIcon } from "lucide-react";
import { Fragment, useRef, useState } from "react";
import FormCategoryDialog, { FormCategoryDialogRef } from "./FormCategoryDialog";
import FormCheckDialog, { FormCheckDialogRef } from "./FormCheckDialog";

type Checklist = InspectionFormCategory & {
    checks: InspectionFormCheck[];
};

type InspectionFormRequest = InspectionForm & {
    checklists: Checklist[];
};

const Edit = ({ vehicleTypes, inspectionData }: PageProps<{ vehicleTypes: VehicleType[]; inspectionData: InspectionFormRequest }>): JSX.Element => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;
    const { data, setData, put, processing, errors } = useForm<InspectionFormRequest>({
        id: inspectionData.id,
        vehicle_type_id: inspectionData.vehicle_type_id,
        type: inspectionData.type,
        code: inspectionData.code,
        name: inspectionData.name,
        use_eta_dest: inspectionData.use_eta_dest,
        use_ata_dest: inspectionData.use_ata_dest,
        is_publish: inspectionData.is_publish,
        checklists: inspectionData.checklists,
    });

    /*** references ***/
    const alertDialog = useRef<AlertDialogRef>(null);
    const errorDialog = useRef<ErrorDialogRef>(null);
    const formCategoryDialog = useRef<FormCategoryDialogRef>(null);
    const formCheckDialog = useRef<FormCheckDialogRef>(null);

    /*** componenet state ***/
    const [alertType, setAlertType] = useState<"category" | "check" | "form">("category");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
    const [selectedCheck, setSelectedCheck] = useState<InspectionFormCheck | undefined>(undefined);

    /*** events ***/
    const handleCategoryFormOpen = () => {
        formCategoryDialog.current?.open();
    };

    const handleCategoryEdit = (id: string) => {
        // get category
        const category = data.checklists.find((item) => item.id === id);

        // open form
        formCategoryDialog.current?.edit(category!);
    };

    const handleCategorySubmit = (category: InspectionFormCategory) => {
        let checklists = [];
        let checks: InspectionFormCheck[] = [];

        // if id exist then edit
        if (category.id) {
            // filter spesific id
            checklists = data.checklists.filter((item) => item.id !== category.id);

            // get checks
            checks = data.checklists.find((item) => item.id === category.id)!.checks;
        } else {
            // just take whatever it has
            checklists = data.checklists;
        }

        // push new data
        checklists.push({
            id: category.id ?? window.crypto.randomUUID(),
            inspection_form_id: window.crypto.randomUUID(),
            stage: category.stage,
            description: category.description,
            order: category.order,
            is_separate_page: category.is_separate_page,
            checks: checks,
        });

        // set new data with sort by order
        setData({
            ...data,
            ...{
                checklists: _.sortBy(checklists, ["order"]),
            },
        });

        // close form
        formCategoryDialog.current?.close();
    };

    const handleCategoryRemove = (state: "confirm" | "open" = "confirm", id?: string, result?: boolean) => {
        // if state = confirm and result = false then stop
        if (state === "confirm" && result === false) return;

        // if state = confirm
        if (state === "confirm") {
            // if result = true
            if (result === true) {
                // get categories
                const categories = data.checklists.filter((item) => item.id !== selectedCategoryId);

                // set data
                setData({
                    ...data,
                    ...{
                        checklists: categories,
                    },
                });
            }

            // clear selected category
            setSelectedCategoryId(undefined);
        }

        if (state === "open") {
            // get category
            const category = data.checklists.find((item) => item.id === id);

            // show confirmation
            alertDialog.current?.open({
                description: `Are you sure want to delete (${category?.description}) category?`,
            });

            // set selected category
            setSelectedCategoryId(id);

            // set alert type
            setAlertType("category");
        }
    };

    const handleCheckFormOpen = (category: InspectionFormCategory) => {
        formCheckDialog.current?.open(category);
    };

    const handleCheckEdit = (category: InspectionFormCategory, id: string) => {
        // get checklist
        const checklist = data.checklists.find((item) => item.id === category.id);

        // get check
        const check = checklist!.checks.find((item) => item.id === id);

        // open form
        formCheckDialog.current?.edit(category, check!);
    };

    const handleCheckSubmit = (check: InspectionFormCheck) => {
        let newChecks = [];
        let checklist = data.checklists.find((item) => item.id === check.inspection_form_category_id);

        // if category exist then edit
        if (check.id) {
            // filter spesific id
            newChecks = checklist!.checks.filter((item) => item.id !== check.id);
        } else {
            // just take whatever it has
            newChecks = checklist!.checks;
        }

        // push new data
        newChecks.push({
            id: check.id ?? window.crypto.randomUUID(),
            inspection_form_category_id: check.inspection_form_category_id,
            description: check.description,
            type: check.type,
            order: check.order,
        });

        // order array
        newChecks = _.sortBy(newChecks, ["order"]);

        // set new checks to category
        checklist = {
            id: checklist?.id,
            inspection_form_id: checklist?.inspection_form_id,
            stage: checklist!.stage,
            description: checklist!.description,
            order: checklist!.order,
            is_separate_page: checklist!.is_separate_page,
            checks: newChecks,
        };

        // filter spesific id
        const checklists = data.checklists.filter((item) => item.id !== checklist.id);

        // set new data with sort by order
        setData({
            ...data,
            ...{
                checklists: _.sortBy([...checklists, checklist], ["order"]),
            },
        });

        // close form
        formCheckDialog.current?.close();
    };

    const handleCheckRemove = (state: "confirm" | "open" = "confirm", check?: InspectionFormCheck, result?: boolean) => {
        // if state = confirm and result = false then stop
        if (state === "confirm" && result === false) return;

        // if state = confirm
        if (state === "confirm") {
            // if result = true
            if (result === true) {
                // get category
                const selectedCategory = data.checklists.find((item) => item.id === selectedCategoryId);

                // filter checks
                const checks = selectedCategory!.checks.filter((item) => item.id !== selectedCheck?.id);

                // filter spesific id
                const checklists = data.checklists.filter((item) => item.id !== selectedCategory!.id);

                // set new checks to category
                let checklist = {
                    id: selectedCategory?.id,
                    inspection_form_id: selectedCategory?.inspection_form_id,
                    stage: selectedCategory!.stage,
                    description: selectedCategory!.description,
                    order: selectedCategory!.order,
                    is_separate_page: selectedCategory!.is_separate_page,
                    checks: checks,
                };

                // set data
                setData({
                    ...data,
                    checklists: [...checklists, checklist],
                });
            }

            // clear selected category
            setSelectedCategoryId(undefined);

            // clear selected check
            setSelectedCheck(undefined);
        }

        if (state === "open") {
            // get category
            const selectedCategory = data.checklists.find((item) => item.id === check!.inspection_form_category_id);

            // get check
            const selectedCheck = selectedCategory?.checks.find((item) => item.id === check!.id);

            // show confirmation
            alertDialog.current?.open({
                description: `Are you sure want to delete (${selectedCheck?.description}) check, in (${selectedCategory?.description}) category?`,
            });

            // set selected category
            setSelectedCategoryId(check?.inspection_form_category_id);

            // set selected id
            setSelectedCheck(check);

            // set alert type
            setAlertType("check");
        }
    };

    const handleConfirmation = (result: boolean) => {
        switch (alertType) {
            case "category":
                handleCategoryRemove("confirm", undefined, result);
                break;
            case "check":
                handleCheckRemove("confirm", undefined, result);
                break;
            case "form":
                handleSubmit("confirm", result);
                break;
            default:
                console.log(undefined);
                break;
        }
    };

    const handleSubmit = (state: "confirm" | "open" = "confirm", result?: boolean) => {
        if (state === "confirm" && result === false) return;

        if (state === "open") {
            // show confirmation
            alertDialog.current?.open();

            // set alert type
            setAlertType("form");
        }

        if (state === "confirm" && result === true) {
            // submit
            handleSubmitForm();
        }
    };

    const handleSubmitForm = () => {
        put(route("ins.form.update", { id: data.id }), {
            onSuccess: (response) => {
                const props = response.props as PageProps;
                const flash = props.flash;
                if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
            },
            onError: (errors) => {
                if (errors.message) {
                    errorDialog.current?.show({ message: errors.message });
                } else {
                    errorDialog.current?.show({ message: refactorErrorMessage(errors) });
                }
            },
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Edit Form" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Edit Form</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Inspection" }, { label: "Forms", link: route("ins.form.index") }, { label: "Edit" }]} />
                </div>
                <div className="flex h-7 items-center space-x-4 justify-between">
                    <Link href={route("ins.form.index")} replace preserveState>
                        <Button type="button" variant={"outline"}>
                            <ChevronLeftIcon className="mr-2 h-4 w-4 stroke-black" />
                            Back
                        </Button>
                    </Link>
                    <Separator orientation="vertical" />
                    <Button type="button" variant={"success"} onClick={() => handleSubmit("open")} disabled={processing}>
                        {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin stroke-white" /> : <CheckIcon className="mr-2 h-4 w-4 stroke-white" />}
                        Save
                    </Button>
                </div>
            </header>

            {/* backend alert */}
            {props.flash.alert && (
                <div className="p-4">
                    <Alert variant={props.flash.alert.variant as any} icon={props.flash.alert.icon} title={props.flash.alert.title} message={props.flash.alert.message} />
                </div>
            )}

            {/* error dialog */}
            <ErrorDialog ref={errorDialog} />

            {/* alert dialog (confirmation) */}
            <AlertDialog ref={alertDialog} onClose={handleConfirmation} />

            {/* form category */}
            <FormCategoryDialog ref={formCategoryDialog} onSubmit={handleCategorySubmit} />

            {/* form category */}
            <FormCheckDialog ref={formCheckDialog} onSubmit={handleCheckSubmit} />

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="grid col-span-2 gap-2">
                            <Label htmlFor="vehicle_type">Vehicle Type</Label>
                            <Select
                                className="w-full"
                                placeholder="Vehicle Type"
                                selectLabel="Vehicle Type"
                                value={data.vehicle_type_id ? data.vehicle_type_id : ""}
                                onValueChange={(value) => setData("vehicle_type_id", value)}
                                items={vehicleTypes.map((vehicleType) => {
                                    return { value: vehicleType.id!, label: vehicleType.name };
                                })}
                            />
                        </div>
                        <div className="grid col-span-2 gap-2">
                            <Label htmlFor="vehicle_type">Inspect Type</Label>
                            <Select
                                className="w-full"
                                placeholder="Inspect Type"
                                selectLabel="Inspect Type"
                                value={data.type}
                                onValueChange={(value) => setData("type", value as InspectionType)}
                                items={Object.entries(InspectionType).map(([label, value]) => {
                                    return { value: value, label: label };
                                })}
                            />
                        </div>
                        <div className="grid col-span-4 gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                name="code"
                                type="text"
                                placeholder="Code"
                                required
                                onChange={(e) => setData("code", e.target.value)}
                                value={data.code}
                                error={errors.code}
                            />
                        </div>
                        <div className="grid col-span-4 gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Name"
                                required
                                onChange={(e) => setData("name", e.target.value)}
                                value={data.name}
                                error={errors.name}
                            />
                        </div>
                        <div className="grid col-span-4 gap-2">
                            <Label htmlFor="use_eta_dest">Use Estimation Time Arrival (ETA Date)</Label>
                            <div className="flex space-x-2 items-center">
                                <Checkbox
                                    id="use_eta_dest"
                                    name="use_eta_dest"
                                    defaultChecked={data.use_eta_dest}
                                    checked={data.use_eta_dest}
                                    onCheckedChange={(e) => setData("use_eta_dest", e.valueOf() as boolean)}
                                />
                                <p className="text-sm text-muted-foreground">Yes</p>
                            </div>
                        </div>
                        <div className="grid col-span-4 gap-2">
                            <Label htmlFor="use_ata_dest">Use Actual Time Arrival (ATA Date)</Label>
                            <div className="flex space-x-2 items-center">
                                <Checkbox
                                    id="use_ata_dest"
                                    name="use_ata_dest"
                                    defaultChecked={data.use_ata_dest}
                                    checked={data.use_ata_dest}
                                    onCheckedChange={(e) => setData("use_ata_dest", e.valueOf() as boolean)}
                                />
                                <p className="text-sm text-muted-foreground">Yes</p>
                            </div>
                        </div>
                        <div className="grid col-span-4 gap-2">
                            <Label htmlFor="is_publish">Publish</Label>
                            <div className="flex space-x-2 items-center">
                                <Checkbox
                                    id="is_publish"
                                    name="is_publish"
                                    defaultChecked={data.is_publish}
                                    checked={data.is_publish}
                                    onCheckedChange={(e) => setData("is_publish", e.valueOf() as boolean)}
                                />
                                <p className="text-sm text-muted-foreground">Yes</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid col-span-12 gap-2 mt-5">
                        <div className="flex justify-between items-center">
                            <Label className="scroll-m-20 text-xl font-semibold tracking-tight">Inspection Checklist</Label>
                            <div className="space-x-2">
                                <Button type="button" variant={"outline"} onClick={handleCategoryFormOpen}>
                                    <PlusIcon className="mr-2 h-4 w-4 " />
                                    Category
                                </Button>
                            </div>
                        </div>
                        <div className="w-full over mt-5">
                            {/* <ScrollArea className="h-[33rem]"> */}
                            {data.checklists.length <= 0 ? (
                                <div className="w-full py-5 text-center">
                                    <Label>Checklist not found, please add category and checklist.</Label>
                                </div>
                            ) : (
                                data.checklists.map((checklist) => {
                                    return (
                                        <Fragment key={checklist.id}>
                                            <div className="mb-5">
                                                <div className="flex justify-between mb-3 items-center">
                                                    <div className="flex flex-col gap-1">
                                                        <Label className="scroll-m-20 text-md font-semibold tracking-tight">{checklist.description}</Label>
                                                        <div className="flex space-x-2">
                                                            <Badge variant={getStage(checklist.stage, "variant") as any}>{getStage(checklist.stage, "label")}</Badge>
                                                            <Badge variant={"outline"}>{checklist.order}</Badge>
                                                            <Badge variant={"outline"}>{checklist.is_separate_page ? "Separate Page" : "Same Page"}</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button type="button" variant={"default"}>
                                                                    <HamburgerMenuIcon className="mr-2 h-4 w-4 " />
                                                                    Category
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleCategoryEdit(checklist.id!)}>
                                                                    <Pencil1Icon className="mr-2 h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleCategoryRemove("open", checklist.id)}>
                                                                    <Cross1Icon className="mr-2 h-4 w-4" /> Remove
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <Button type="button" variant={"outline"} onClick={() => handleCheckFormOpen(checklist)}>
                                                            <PlusIcon className="mr-2 h-4 w-4 " />
                                                            Check
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Table className="rounded-sm border">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-auto">Description</TableHead>
                                                            <TableHead className="w-[100px]">Type</TableHead>
                                                            <TableHead className="text-center w-[100px]">Order</TableHead>
                                                            <TableHead className="w-[40px]"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {checklist.checks.length <= 0 ? (
                                                            <TableRow className="w-full text-center">
                                                                <TableCell colSpan={2}>Check not found.</TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            checklist.checks.map((check) => (
                                                                <TableRow key={check.id}>
                                                                    <TableCell>{check.description}</TableCell>
                                                                    <TableCell>{check.type}</TableCell>
                                                                    <TableCell className="text-center">{check.order}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button type="button" variant={"default"} size={"icon"}>
                                                                                    <HamburgerMenuIcon className="h-4 w-4 " />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent>
                                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem onClick={() => handleCheckEdit(checklist, check.id!)}>
                                                                                    <Pencil1Icon className="mr-2 h-4 w-4" /> Edit
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={() => handleCheckRemove("open", check)}>
                                                                                    <Cross1Icon className="mr-2 h-4 w-4" /> Remove
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </Fragment>
                                    );
                                })
                            )}
                            {/* </ScrollArea> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Edit;
