import { user } from "../models/user";

function executeAtTargetTime() {
    user.findAll({
        where: {
            loginAttempts: 20
        }
    })
    .then(usersWithTooManyLoginAttempts => {
        //Resetting login attempt counter
        usersWithTooManyLoginAttempts.map(async (usr) => {
            let newUsr = {
                name: usr.name,
                email: usr.email,
                password: usr.password,
                loginAttempts: 0
            }

            await user.update(newUsr, {
                where: {
                    userId: usr.userId
                }
            })

            console.log(`${usr.name} Had too many failed login attempts yesterday, their attempts have been reset`)
        })
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

function getNextTargetTime(targetHour: number, targetMinute: number): number {
    const now: Date = new Date();
    const targetTime: Date = new Date();

    targetTime.setHours(targetHour, targetMinute, 0, 0);

    // If the target time has already passed today, set it to the same time tomorrow
    if (targetTime.getTime() <= now.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    // Calculate the time difference in milliseconds
    return targetTime.getTime() - now.getTime();
}

export function scheduleTargetTimeExecution(targetHour: number, targetMinute: number) {
    const timeToTarget: number = getNextTargetTime(targetHour, targetMinute);
    setTimeout(() => {
        executeAtTargetTime();
        setInterval(executeAtTargetTime, 24 * 60 * 60 * 1000); // Repeat every 24 hours
    }, timeToTarget);
}

