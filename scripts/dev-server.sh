#!/usr/bin/env bash
# Start or stop the local Docusaurus dev server (yarn start, zh-Hans).
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

port=3000
pid_file="$root/temp/dev.pid"
log_file="$root/temp/dev.log"

mkdir -p "$root/temp"

is_alive() {
	local pid="$1"
	[[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

pgid_of() {
	ps -o pgid= -p "$1" 2>/dev/null | tr -d ' '
}

kill_group() {
	local pid="$1"
	local pgid my_pgid
	is_alive "$pid" || return 0
	pgid="$(pgid_of "$pid" || true)"
	my_pgid="$(pgid_of "$$" || true)"
	if [[ -n "$pgid" && "$pgid" != "$my_pgid" ]]; then
		kill -TERM "-$pgid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
	else
		kill -TERM "$pid" 2>/dev/null || true
	fi
	local i=0
	while is_alive "$pid" && [[ $i -lt 20 ]]; do
		sleep 0.5
		i=$((i + 1))
	done
	if is_alive "$pid"; then
		if [[ -n "${pgid:-}" && "$pgid" != "$my_pgid" ]]; then
			kill -KILL "-$pgid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
		else
			kill -KILL "$pid" 2>/dev/null || true
		fi
	fi
}

# Node processes that belong to this repo's dev server.
dev_pids() {
	local line pid cmd cwd
	while IFS= read -r line; do
		[[ -z "$line" ]] && continue
		pid="${line%% *}"
		cmd="${line#* }"
		case "$cmd" in
		node\ * | */node\ *) ;;
		*) continue ;;
		esac
		case "$cmd" in
		*"$root/node_modules/.bin/docusaurus start"* | *"$root/node_modules/.bin/cross-env "*)
			echo "$pid"
			continue
			;;
		esac
		case "$cmd" in
		*"/yarn start" | *" yarn start")
			cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1 || true)"
			if [[ "$cwd" == "$root" ]]; then
				echo "$pid"
			fi
			;;
		esac
	done < <(ps -ax -o pid=,command= | sed 's/^ *//')
}

cmd_start() {
	local pid cmd
	if [[ -f "$pid_file" ]]; then
		pid="$(cat "$pid_file" || true)"
		if is_alive "$pid"; then
			echo "dev server already running (pid $pid): http://localhost:$port"
			exit 0
		fi
		rm -f "$pid_file"
	fi

	# Adopt a server started outside this script, so `make stop` can find it.
	while IFS= read -r pid; do
		[[ -z "$pid" ]] && continue
		cmd="$(ps -p "$pid" -o command= || true)"
		case "$cmd" in
		*"$root/node_modules/.bin/docusaurus start"*)
			echo "$pid" >"$pid_file"
			echo "dev server already running (pid $pid): http://localhost:$port"
			exit 0
			;;
		esac
	done < <(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)

	if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
		echo "port $port is already in use"
		lsof -nP -iTCP:"$port" -sTCP:LISTEN
		exit 1
	fi

	# Own process group so stop can tear down yarn, cross-env, and docusaurus together.
	set -m
	nohup yarn start >"$log_file" 2>&1 &
	echo $! >"$pid_file"
	pid="$(cat "$pid_file")"
	sleep 1
	if ! is_alive "$pid"; then
		echo "dev server exited, see $log_file"
		tail -n 40 "$log_file" || true
		rm -f "$pid_file"
		exit 1
	fi
	echo "dev server starting (pid $pid)"
	echo "log: $log_file"
	echo "url: http://localhost:$port"
}

cmd_stop() {
	local pid stopped=0
	if [[ -f "$pid_file" ]]; then
		pid="$(cat "$pid_file" || true)"
		if is_alive "$pid"; then
			kill_group "$pid"
			echo "stopped pid $pid"
			stopped=1
		fi
		rm -f "$pid_file"
	fi

	local -a pids=()
	while IFS= read -r pid; do
		[[ -z "$pid" ]] && continue
		pids+=("$pid")
	done < <(dev_pids || true)

	for pid in "${pids[@]+"${pids[@]}"}"; do
		if is_alive "$pid"; then
			kill_group "$pid"
			echo "stopped pid $pid"
			stopped=1
		fi
	done

	if [[ "$stopped" -eq 0 ]]; then
		echo "dev server is not running"
	fi
}

case "${1:-}" in
start) cmd_start ;;
stop) cmd_stop ;;
*)
	echo "usage: $0 start|stop" >&2
	exit 1
	;;
esac
