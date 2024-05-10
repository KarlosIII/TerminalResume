const font = 'Slant';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const directories = {
    introduction:[
        '',
        '* <white>I am a <b>cybersecurity</b> passionate with a strong focus on defensive strategies, dedicated to safeguarding organizations</white>',
        '* <white>from cyber threats. Continuously expanding my skills and knowledge, I actively share my experience to support our collective learning journey.</white>',
        '* <white>Here are a few details about myself that you can uncover through this simulated terminal and </white><red>rest assured, there is much more to come as I embark on my cybersecurity journey.</red>',
        '* <white>Let\'s connect to explore common interests or discuss how I can contribute to your organization\'s cybersecurity efforts.</white> ',
    ],
    certification: [
        '',
        '<white>certifications</white>',

        '* <red>CompTIA</red> Cybersecurity Analyst <white>CYSA+</white>',
        '* <red>CompTIA</red> Security+ <white>SEC+</white>',
        '* <red>CompTIA</red> Network+ <white>NET+</white>',
        '* <red>CompTIA</red> Analyst+ <white>A+</white>'
    ],
    education: [
        '',
        '<white>education</white>',

        '* <white>Human Ressource</white> <a href="https://www.umontreal.ca/">University of Montreal</a> <yellow>"Human Ressource"</yellow> 20**-20**',
        '* <white>Electrotechnic</white> <a href="">College</a> <yellow>"High Voltage speciality"</yellow> 20**',
        '* <white>Industrial Electronic (OT)</white> <a href="">College</a> <yellow>"PLC and HMI programming"</yellow> 20**-20**',
        ''
    ],
    experience: [
        '',
        '<blue>Blue team</blue> experience through learning path on TryHackMe platform',
        [
            ['SOC level 1','https://tryhackme.com/path/outline/soclevel1','learn the junior security analyst role'],
            ['SOC level 2','https://tryhackme.com/path/outline/soclevel2', 'learn the skill to transition to level 2 SOC position'],
            ['Security Engineer','https://tryhackme.com/path/outline/security-engineer-training', 'Introduction to security engineering from various perspectives'],
            ['Cyber Defense','https://tryhackme.com/path/outline/blueteam', 'Broad introduction to the different areas necessary to detect and respond to threats'],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
         '',
        '<red>Red team</red> experience through learning path on TryHackMe platform',
        [
            ['Jr Penetration Tester','https://tryhackme.com/path/outline/jrpenetrationtester','learning the core technical skills for a junior penetration tester'],
            ['CompTIA Pentest+','https://tryhackme.com/path/outline/pentestplus', 'practice the majority of practical skills required for the CompTIA PenTest+ exam'],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),

    ].flat(),
    skills: [
        '',
        '<white>skills</white>',

        [
            'Gouvernance, risk and compliance',
            'Cyber threats intelligence',
            'Incidents response',
            'Operatings Systems',
            'Threats hunting',
            'Logs analysis',
            'Scripting',
            
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>softwares</white>',
        [
            'Windows Defender',
            'Metasploit',
            'Wireshark',
            'Nessus',
            'Splunk',
            'Snort',
            'Wazuh',
            'Linux',
            'NMAP',
            
        ].map(lib => `* <green>${lib}</green>`),
        '',
        /* '<white>tools</white>',
        [
            'Docker',
            'git',
            'GNU/Linux'
        ].map(lib => `* <blue>${lib}</blue>`),
        '' */
    ].flat()
};

const dirs = Object.keys(directories);

const root = '~';
let cwd = root;

const user = 'BeMyGuest';
const server = 'freecoffee.org';

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

function print_dirs() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
}

const commands = {
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    ls(dir = null) {
        if (dir) {
            if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
           print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    async joke() {
        // we use programming jokes so it fit better developer portfolio
        const res = await fetch('https://v2.jokeapi.dev/joke/Programming');
        const data = await res.json();
        (async () => {
            if (data.type == 'twopart') {
                // we set clear the prompt to don't have any
                // flashing between animations
                const prompt = this.get_prompt();
                this.set_prompt('');
                // as said before in every function, passed directly
                // to terminal, you can use `this` object
                // to reference terminal instance
                await this.echo(`Q: ${data.setup}`, {
                    delay: 50,
                    typing: true
                });
                await this.echo(`A: ${data.delivery}`, {
                    delay: 50,
                    typing: true
                });
                // we restore the prompt
                this.set_prompt(prompt);
            } else if (data.type === 'single') {
                await this.echo(data.joke, {
                    delay: 50,
                    typing: true
                });
            }
        })();
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    credits() {
        // you can return string or a Promise from a command
        return [
            '',
            '<white>Used libraries and big thanks to Jakub T. Jankiewicz for the fun project :) </white>',
            '* <a href="https://jakub.jankiewicz.org/">Jakub T. Jankiewicz</a>',
            '* <a href="https://www.freecodecamp.org/news/how-to-create-interactive-terminal-based-portfolio/">FreeCodeCamp</a>',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '* <a href="https://jokeapi.dev/">Joke API</a>',
            ''
        ].join('\n');
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    }
};

// clear is default command that you can turn off with an option
const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => `<white class="command">${cmd}</white>`);
const help = formatter.format(formatted_list);

const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<white class="command">${command}</white><aquamarine>${args}</aquamarine>`;
}]);

$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;]`;
};

const term = $('body').terminal(commands, {
    greetings: function generateGreetings()  {
        let date = new Date();
        let hour = date.getHours();
        let greetingMessage = "";

        if (hour < 12) {
            greetingMessage = "Good morning!";
        } else if (hour < 18) {
            greetingMessage = "Good afternoon!";
        } else {
            greetingMessage = "Good evening!";
        }

        return greetingMessage + "                      Welcome to the Terminal!            type  \"ls\" to start";
    },
    checkArity: false,
    completion(string) {
        // in every function we can use this to reference term object
        const { name, rest } = $.terminal.parse_command(this.get_command());
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    prompt
});

term.pause();

term.on('click', '.command', function() {
   const command = $(this).text();
   term.exec(command, { typing: true, delay: 50 });
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`, { typing: true, delay: 50 });
});

function ready() {
   const seed = rand(256);
   term.echo(() => rainbow(render('Terminal Resume'), seed))
       .echo('<white>Welcome to my Terminal Personal Resume</white>\n').resume();
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}



    


