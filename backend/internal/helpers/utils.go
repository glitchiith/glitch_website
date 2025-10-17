package helpers

import "strconv"

func GetValue(value interface{}) string {
	switch v := value.(type) {
	case *string:
		if v != nil {
			return *v
		}
	case *int:
		if v != nil {
			return strconv.Itoa(*v)
		}
	}
	return ""
}
