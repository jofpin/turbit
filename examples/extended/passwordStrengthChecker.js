const fs = require("fs");
const path = require("path");

let Turbit;

try {
  // Try to import the installed version of Turbit
  Turbit = require("turbit");
} catch (error) {
  // If the library is not installed, use the local version
  Turbit = require("../../turbit");
}

// Create a Turbit instance for parallel processing
const turbit = Turbit();

/**
 * passwordGenerator: Generates a strong password of a predefined length using a set of characters.
 */
const passwordGenerator = function() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",.<>/?";
    const length = 22;
    let password = "";
    for (let i = 0; i < length; i++) {
        const random = Math.floor(Math.random() * chars.length);
        password += chars[random];
    }
    return password;
}
/**
 * checkStrength: Checks the strength of an array of passwords based on specific criteria.
 */
const checkStrength = function(passwords) {
    return passwords.map(password => {
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        const numbers = /\d/.test(password);
        const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        const isStrong = password.length >= 8 && uppercase && lowercase && numbers && special;
        return { password, isStrong };
    });
}
/**
 * saveDataPasswords: Saves the password strength check results to a CSV file.
 */
const saveDataPasswords = function(results, filename) {
    const csvLines = results.map(result =>
        `"${result.password.replace(/"/g, '""')}",${result.isStrong}`
    );
    csvLines.unshift("password,isStrong");
    fs.writeFileSync(filename, csvLines.join("\n"));
}
/**
 * main: Generate passwords, check their strength, and save the results.
 */
const main = async function() {
    const numPasswords = 1000000; // At this moment it generates a million data, but you can modify it to your liking.
    const passwords = Array.from({ length: numPasswords }, passwordGenerator);

    try {
        const results = await turbit.run(checkStrength, {
            type: "extended",
            data: passwords,
            power: 100 // Uses 100% of available cores
        });

        turbit.kill();

        saveDataPasswords(results.data, path.join(__dirname, "passwords.csv"));

        console.log("")
        console.log("")
        console.log("Generated passwords:", numPasswords)
        console.log("-")
        console.log('Results saved in passwords.csv');
        console.log("-")
        console.log("Stats:", results.stats)
        console.log("")
        console.log("")
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        turbit.kill();
    }
}

main();