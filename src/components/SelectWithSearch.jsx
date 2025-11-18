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
            renderInput={(params) => (
                <TextField {...params} label={label} placeholder="Search..." variant="outlined" />
            )}
            size="small"
            fullWidth
        />
    );
}
