import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function SelectWithSearch({
    options = [],
    value,
    onChange,
    label = "Select",
    labelField = "name",
    multiple = false,
}) {
    return (
        <Autocomplete
            multiple={multiple}
            options={options}
            getOptionLabel={(option) => option?.[labelField] || ""}
            value={value}
            onChange={onChange}
            isOptionEqualToValue={(option, value) => option._id === value._id} // E.g. name could reasonably be duplicate, force use of id instead.
            renderOption={(props, option) => (
                <li {...props} key={option._id}>
                    {option[labelField]}
                </li>
            )}
            renderInput={(params) => (
                <TextField {...params} label={label} placeholder="Search..." variant="outlined" />
            )}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
        />
    );
}
