import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { DateTime } from "luxon";

export const dateJSToFormat = (date: Date, toFormat: string): string => {
    return DateTime.fromJSDate(date).toFormat(toFormat);
};

export const dateJSFormat = (value: Date): string => {
    const props = usePage<PageProps>().props;

    return DateTime.fromJSDate(value).setLocale(props.config.locale).toFormat(props.config.date_format);
};

export const timeJSFormat = (value: Date): string => {
    const props = usePage<PageProps>().props;

    return DateTime.fromJSDate(value).setLocale(props.config.locale).toFormat(props.config.time_format);
};

export const dateTimeJSFormat = (value: Date): string => {
    const props = usePage<PageProps>().props;

    return DateTime.fromJSDate(value).setLocale(props.config.locale).toFormat(props.config.datetime_format);
};
