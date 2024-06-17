using System.Text.RegularExpressions;

namespace HttpLogViewer.Api.Misc
{
    public static class StringExtensions
    {
        public static string ToTitleCaseFromCamelCase(this string camelCaseString)
        {
            if (string.IsNullOrEmpty(camelCaseString))
            {
                return camelCaseString;
            }

            // Use a regular expression to split the camel case string
            var result = Regex.Replace(camelCaseString, "([a-z])([A-Z])", "$1 $2");

            // Capitalize the first letter of the result
            return char.ToUpper(result[0]) + result.Substring(1);
        }
    }
}
